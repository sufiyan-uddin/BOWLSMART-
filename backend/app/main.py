"""
BowlSmart Backend — AI-Powered Fast Bowling Analysis Service

This FastAPI service handles:
1. Video ingestion & validation
2. MediaPipe pose detection (33 body landmarks per frame)
3. Bowling phase detection (run-up → follow-through)
4. Biomechanics calculations (angles, velocities, alignment)
5. Injury risk scoring
6. Form scoring per phase
7. Gemini API report generation with drill recommendations
"""

from fastapi import FastAPI, UploadFile, File, Form, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from typing import Optional
import uuid
import os
import asyncio
import numpy as np

from app.config import settings
from app.services.video_processor import VideoProcessor
from app.services.pose_detector import PoseDetector
from app.services.phase_detector import PhaseDetector
from app.services.biomechanics import BiomechanicsCalculator
from app.services.injury_scorer import InjuryScorer
from app.services.form_scorer import FormScorer
from app.services.report_generator import ReportGenerator
from app.services.video_annotator import VideoAnnotator
from app.services.coach_chat import CoachChat

app = FastAPI(
    title="BowlSmart API",
    description="AI-powered cricket fast bowling analysis backend",
    version="1.0.0",
)

# CORS — allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads and annotated videos directories exist
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
ANNOTATED_DIR = os.path.join(os.path.dirname(settings.UPLOAD_DIR), "annotated_videos")
os.makedirs(ANNOTATED_DIR, exist_ok=True)

# In-memory job store (replace with Redis/DB in production)
analysis_jobs: dict = {}

# Coach chat instance (shared across requests)
coach_chat = CoachChat()

def convert_numpy(obj):
    if isinstance(obj, np.integer):
        return int(obj)
    elif isinstance(obj, np.floating):
        return float(obj)
    elif isinstance(obj, np.ndarray):
        return obj.tolist()
    elif isinstance(obj, dict):
        return {k: convert_numpy(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [convert_numpy(v) for v in obj]
    elif isinstance(obj, tuple):
        return tuple(convert_numpy(v) for v in obj)
    return obj


class BowlerProfile(BaseModel):
    age: int
    height_cm: float
    weight_kg: float
    dominant_arm: str  # "right" or "left"
    bowling_style: str  # "seam", "swing", "express_pace"
    experience_level: str  # "beginner", "club", "academy", "professional"
    self_reported_pace: Optional[float] = None
    pace_unit: str = "kmh"
    existing_injuries: list[str] = []
    goals: list[str] = []


class AnalysisStatus(BaseModel):
    job_id: str
    status: str  # "processing", "complete", "failed"
    progress: int  # 0-100
    current_step: str
    result: Optional[dict] = None
    error: Optional[str] = None


@app.get("/api/v1/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "bowlsmart-analysis",
        "version": "1.0.0",
        "gemini_configured": bool(settings.GEMINI_API_KEY),
    }


@app.post("/api/v1/analyze")
async def start_analysis(
    background_tasks: BackgroundTasks,
    video: UploadFile = File(...),
    age: int = Form(22),
    height_cm: float = Form(180),
    weight_kg: float = Form(75),
    dominant_arm: str = Form("right"),
    bowling_style: str = Form("seam"),
    experience_level: str = Form("club"),
    self_reported_pace: Optional[float] = Form(None),
    camera_angle: str = Form("side_on"),
):
    """Upload a bowling video and start the analysis pipeline."""

    job_id = str(uuid.uuid4())

    # Save uploaded video temporarily
    upload_dir = os.path.join(settings.UPLOAD_DIR, job_id)
    os.makedirs(upload_dir, exist_ok=True)
    video_path = os.path.join(upload_dir, video.filename or "bowling_video.mp4")

    with open(video_path, "wb") as f:
        content = await video.read()
        f.write(content)

    # Build bowler profile
    bowler_profile = BowlerProfile(
        age=age,
        height_cm=height_cm,
        weight_kg=weight_kg,
        dominant_arm=dominant_arm,
        bowling_style=bowling_style,
        experience_level=experience_level,
        self_reported_pace=self_reported_pace,
    )

    # Initialize job status
    analysis_jobs[job_id] = {
        "status": "processing",
        "progress": 0,
        "current_step": "Initializing...",
        "result": None,
        "error": None,
    }

    # Run analysis in background
    background_tasks.add_task(
        run_analysis_pipeline, job_id, video_path, bowler_profile, camera_angle
    )

    return {"job_id": job_id, "status": "processing"}


@app.get("/api/v1/analyze/{job_id}/status")
async def get_analysis_status(job_id: str):
    """Check the status of a running analysis."""
    if job_id not in analysis_jobs:
        raise HTTPException(status_code=404, detail="Analysis job not found")

    job = analysis_jobs[job_id]
    return AnalysisStatus(job_id=job_id, **job)


@app.get("/api/v1/analyze/{job_id}/video")
async def get_annotated_video(job_id: str):
    """Serve the annotated skeleton-overlay video for a completed analysis."""
    if job_id not in analysis_jobs:
        raise HTTPException(status_code=404, detail="Analysis job not found")

    job = analysis_jobs[job_id]
    if job["status"] != "complete":
        raise HTTPException(status_code=400, detail="Analysis not complete")

    video_path = job.get("annotated_video_path")
    if not video_path or not os.path.exists(video_path):
        raise HTTPException(status_code=404, detail="Annotated video not available")

    from fastapi.responses import FileResponse
    return FileResponse(video_path, media_type="video/mp4", filename=f"bowlsmart_{job_id}.mp4")


@app.get("/api/v1/analyze/{job_id}/result")
async def get_analysis_result(job_id: str):
    """Get the full result of a completed analysis."""
    if job_id not in analysis_jobs:
        raise HTTPException(status_code=404, detail="Analysis job not found")

    job = analysis_jobs[job_id]
    if job["status"] != "complete":
        raise HTTPException(
            status_code=400,
            detail=f"Analysis not complete. Status: {job['status']}",
        )

    return job["result"]


class ChatRequest(BaseModel):
    message: str
    phase: str  # run_up, bound, back_foot_contact, front_foot_contact, delivery, follow_through, bowling_arm, non_bowling_arm


@app.post("/api/v1/analyze/{job_id}/chat")
async def chat_with_coach(job_id: str, req: ChatRequest):
    """Chat with Coach BowlSmart about a specific phase of the bowling action."""
    if job_id not in analysis_jobs:
        raise HTTPException(status_code=404, detail="Analysis job not found")

    job = analysis_jobs[job_id]
    if job["status"] != "complete":
        raise HTTPException(status_code=400, detail="Analysis not complete")

    result = job["result"]
    biomechanics = result.get("biomechanics", {})
    bowler_profile = result.get("bowler_profile", {})
    ai_report = result.get("ai_report", {})

    reply = await coach_chat.chat(
        job_id=job_id,
        phase=req.phase,
        user_message=req.message,
        biomechanics=biomechanics,
        bowler_profile=bowler_profile,
        ai_report=ai_report,
    )

    return {"reply": reply, "phase": req.phase}


@app.get("/api/v1/analyze/{job_id}/chat/phases")
async def get_chat_phases(job_id: str):
    """Get available phases for chat with their display names."""
    if job_id not in analysis_jobs:
        raise HTTPException(status_code=404, detail="Analysis job not found")

    from app.services.coach_chat import PHASE_CONTEXT
    phases = []
    for key, info in PHASE_CONTEXT.items():
        phases.append({
            "id": key,
            "name": info["display_name"],
            "focus_areas": info["focus_areas"],
        })
    return {"phases": phases}


async def run_analysis_pipeline(
    job_id: str, video_path: str, bowler_profile: BowlerProfile, camera_angle: str
):
    """
    Main analysis pipeline — runs as a FastAPI background task.
    All CPU-heavy synchronous steps are offloaded to a thread pool via
    run_in_executor so the event loop stays free to serve status polls.
    """
    job = analysis_jobs[job_id]
    loop = asyncio.get_running_loop()

    def _run(fn, *args):
        """Helper: run a sync callable in the default thread pool."""
        import functools
        return loop.run_in_executor(None, functools.partial(fn, *args))

    try:
        # ── Step 1: Validate & extract frames ────────────────────────────
        job["current_step"] = "Validating video..."
        job["progress"] = 5

        video_processor = VideoProcessor()
        video_info = await _run(video_processor.validate_video, video_path)
        frames = await _run(video_processor.extract_frames, video_path, 10)  # 10fps is enough for phase analysis

        job["progress"] = 15
        job["current_step"] = f"Extracted {len(frames)} frames"

        if len(frames) < 10:
            raise ValueError(
                f"Only {len(frames)} frames extracted. Video may be too short or corrupted."
            )

        # ── Step 2: Pose detection ────────────────────────────────────────
        job["current_step"] = "Running pose detection..."
        job["progress"] = 25

        pose_detector = PoseDetector()
        landmarks_sequence = await _run(pose_detector.detect_poses, frames)
        smoothed_landmarks = await _run(pose_detector.smooth_landmarks, landmarks_sequence)

        valid_count = sum(1 for lm in smoothed_landmarks if lm is not None)
        job["progress"] = 45
        job["current_step"] = f"Detected poses in {valid_count}/{len(frames)} frames"

        if valid_count < 10:
            raise ValueError(
                f"Pose detected in only {valid_count} frames. "
                "Ensure the bowler is clearly visible and well-lit."
            )

        # ── Step 2b: Action validation (Is this actually a bowler?) ────────
        job["current_step"] = "Validating bowling action..."
        await asyncio.sleep(0)
        
        is_bowling = False
        bowl_wrist_name = "right_wrist" if bowler_profile.dominant_arm == "right" else "left_wrist"
        
        for frame in smoothed_landmarks:
            if frame is not None and "landmarks" in frame:
                lms = frame["landmarks"]
                wrist = lms.get(bowl_wrist_name)
                nose = lms.get("nose")
                
                # In MediaPipe, y=0 is top of image, y=1 is bottom
                # If wrist y is less than nose y, arm is above head
                if wrist and nose and wrist["y"] < nose["y"]:
                    is_bowling = True
                    break
        
        if not is_bowling:
            raise ValueError(
                "No bowling action detected. The bowling arm never went above the head. "
                "Please upload a valid cricket fast bowling video."
            )

        # ── Step 3: Phase detection ───────────────────────────────────────
        job["current_step"] = "Detecting bowling phases..."
        job["progress"] = 50

        phase_detector = PhaseDetector()
        phases = await _run(
            phase_detector.detect_phases,
            smoothed_landmarks,
            video_info["fps"],
            bowler_profile.dominant_arm,
        )
        job["progress"] = 60

        # ── Step 4: Biomechanics ──────────────────────────────────────────
        job["current_step"] = "Calculating biomechanics..."
        job["progress"] = 65

        bio_calculator = BiomechanicsCalculator(bowler_profile.dominant_arm)
        biomechanics = await _run(
            bio_calculator.calculate_all,
            smoothed_landmarks,
            phases,
            video_info["fps"],
            bowler_profile.height_cm,
        )
        job["progress"] = 75

        # ── Step 5: Scoring ───────────────────────────────────────────────
        job["current_step"] = "Scoring your action..."
        job["progress"] = 80

        form_scorer = FormScorer()
        phase_scores = await _run(form_scorer.score_phases, biomechanics, phases)
        overall_score = await _run(form_scorer.calculate_overall_score, phase_scores)
        pace_leaks = await _run(form_scorer.identify_pace_leaks, biomechanics, phase_scores)
        max_pace_potential = await _run(form_scorer.estimate_max_pace, biomechanics, bowler_profile)

        injury_scorer = InjuryScorer()
        injury_risk = await _run(injury_scorer.calculate_risk, biomechanics, bowler_profile)

        job["progress"] = 90

        # ── Step 6: AI Report (Gemini judges everything) ──────────────────
        job["current_step"] = "AI is judging your action..."
        report_gen = ReportGenerator()
        ai_report = await report_gen.generate_report(
            bowler_profile=bowler_profile.model_dump(),
            biomechanics=biomechanics,
            phase_scores=phase_scores,
            overall_score=overall_score,
            injury_risk=injury_risk,
            pace_leaks=pace_leaks,
            max_pace_potential=max_pace_potential,
        )

        # If AI returned its own scores, use those instead of rule-based
        if "overall_score" in ai_report:
            overall_score = ai_report["overall_score"]
        if "phase_scores" in ai_report:
            phase_scores = ai_report["phase_scores"]
        if "injury_risk" in ai_report:
            injury_risk = ai_report["injury_risk"]
        if "pace_leaks" in ai_report:
            pace_leaks = ai_report["pace_leaks"]
        if "max_pace_potential" in ai_report:
            max_pace_potential = ai_report["max_pace_potential"]

        # ── Step 7: Generate annotated video ─────────────────────────
        job["current_step"] = "Generating annotated video..."
        job["progress"] = 95

        annotator = VideoAnnotator(bowler_profile.dominant_arm)
        annotated_video_path = os.path.join(ANNOTATED_DIR, f"{job_id}.mp4")
        annotation_result = await _run(
            annotator.generate_annotated_video,
            frames, smoothed_landmarks, phases,
            annotated_video_path, 10.0,
        )

        result = {
            "overall_score": overall_score,
            "phase_scores": phase_scores,
            "biomechanics": biomechanics,
            "injury_risk": injury_risk,
            "pace_leaks": pace_leaks,
            "max_pace_potential": max_pace_potential,
            "ai_report": ai_report,
            "video_info": video_info,
            "phases": phases,
            "bowler_profile": bowler_profile.model_dump(),
            "phase_timestamps": annotation_result.get("phase_timestamps", {}),
            "annotated_video_duration": annotation_result.get("duration_sec", 0),
        }

        job["status"] = "complete"
        job["progress"] = 100
        job["current_step"] = "Analysis complete!"
        job["result"] = convert_numpy(result)
        job["annotated_video_path"] = annotated_video_path

    except Exception as e:
        job["status"] = "failed"
        job["error"] = str(e)
        job["current_step"] = f"Error: {str(e)}"
        print(f"Analysis pipeline error for job {job_id}: {e}")
        import traceback
        traceback.print_exc()

    finally:
        try:
            if os.path.exists(video_path):
                os.remove(video_path)
            upload_dir = os.path.dirname(video_path)
            if os.path.exists(upload_dir) and not os.listdir(upload_dir):
                os.rmdir(upload_dir)
        except Exception:
            pass


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
