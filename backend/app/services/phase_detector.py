"""
Bowling Phase Detection — automatically identifies the 6 phases of a fast bowling action
from MediaPipe landmark sequences.

Phases:
1. Run-Up: Forward horizontal movement, alternating leg positions
2. Bound/Gather: Both feet elevated, body rises
3. Back-Foot Contact (BFC): Back foot plants on ground
4. Front-Foot Contact (FFC): Front foot strikes, arm at highest point
5. Delivery Stride: Arm rotation through release point
6. Follow-Through: Post-release deceleration
"""

import numpy as np


class PhaseDetector:
    """Detects bowling phases from landmark time-series data."""

    def detect_phases(
        self, landmarks_seq: list[dict | None], fps: float, dominant_arm: str = "right"
    ) -> dict:
        """
        Analyze landmarks to detect bowling phase boundaries.
        
        Returns dict with phase name → {start_frame, end_frame, start_time, end_time}
        """
        valid_frames = [(i, lm) for i, lm in enumerate(landmarks_seq) if lm is not None]
        if len(valid_frames) < 10:
            raise ValueError("Not enough valid frames for phase detection (need at least 10)")

        total_frames = len(landmarks_seq)
        
        # Determine which side is bowling arm vs front
        if dominant_arm == "right":
            bowl_shoulder = "right_shoulder"
            bowl_wrist = "right_wrist"
            bowl_elbow = "right_elbow"
            front_hip = "left_hip"
            back_hip = "right_hip"
            front_knee = "left_knee"
            back_knee = "right_knee"
            front_ankle = "left_ankle"
            back_ankle = "right_ankle"
        else:
            bowl_shoulder = "left_shoulder"
            bowl_wrist = "left_wrist"
            bowl_elbow = "left_elbow"
            front_hip = "right_hip"
            back_hip = "left_hip"
            front_knee = "right_knee"
            back_knee = "left_knee"
            front_ankle = "right_ankle"
            back_ankle = "left_ankle"

        # Extract key signals
        hip_x = []  # Horizontal position of hips (for run-up detection)
        hip_y = []  # Vertical position of hips
        wrist_y = []  # Bowling wrist height (for delivery detection)
        front_ankle_y = []
        back_ankle_y = []

        for i, lm in valid_frames:
            landmarks = lm["landmarks"]
            hip_center_x = (landmarks.get(front_hip, {}).get("x", 0) + landmarks.get(back_hip, {}).get("x", 0)) / 2
            hip_center_y = (landmarks.get(front_hip, {}).get("y", 0) + landmarks.get(back_hip, {}).get("y", 0)) / 2
            
            hip_x.append(hip_center_x)
            hip_y.append(hip_center_y)
            wrist_y.append(landmarks.get(bowl_wrist, {}).get("y", 1))
            front_ankle_y.append(landmarks.get(front_ankle, {}).get("y", 1))
            back_ankle_y.append(landmarks.get(back_ankle, {}).get("y", 1))

        hip_x = np.array(hip_x)
        hip_y = np.array(hip_y)
        wrist_y = np.array(wrist_y)
        front_ankle_y = np.array(front_ankle_y)
        back_ankle_y = np.array(back_ankle_y)

        n = len(valid_frames)

        # --- Phase boundary detection ---
        
        # Find delivery point: when bowling wrist is at its LOWEST y (highest point in image coords)
        # In MediaPipe, y=0 is top of image, so minimum y = highest point
        delivery_idx = int(np.argmin(wrist_y))
        
        # FFC is just before delivery (when front foot hits the ground)
        # Look for front ankle reaching stable low y (high y value = ground level) before delivery
        ffc_search_start = max(0, delivery_idx - int(n * 0.3))
        ffc_search_end = delivery_idx
        if ffc_search_start < ffc_search_end:
            ffc_region = front_ankle_y[ffc_search_start:ffc_search_end]
            ffc_offset = int(np.argmax(ffc_region))  # Max y = lowest point = ground contact
            ffc_idx = ffc_search_start + ffc_offset
        else:
            ffc_idx = max(0, delivery_idx - 3)

        # BFC is before FFC
        bfc_search_start = max(0, ffc_idx - int(n * 0.25))
        bfc_search_end = ffc_idx
        if bfc_search_start < bfc_search_end:
            bfc_region = back_ankle_y[bfc_search_start:bfc_search_end]
            bfc_offset = int(np.argmax(bfc_region))
            bfc_idx = bfc_search_start + bfc_offset
        else:
            bfc_idx = max(0, ffc_idx - 3)

        # Bound is between run-up and BFC
        # Detected by hip vertical position being at minimum (body at highest elevation)
        bound_search_start = max(0, bfc_idx - int(n * 0.3))
        bound_search_end = bfc_idx
        if bound_search_start < bound_search_end:
            bound_region = hip_y[bound_search_start:bound_search_end]
            bound_offset = int(np.argmin(bound_region))  # Lowest y = highest body position
            bound_idx = bound_search_start + bound_offset
        else:
            bound_idx = max(0, bfc_idx - 3)

        # Follow-through starts after delivery
        follow_through_idx = min(delivery_idx + 2, n - 1)

        # Map back to original frame indices
        frame_map = [i for i, _ in valid_frames]
        
        def safe_frame(idx):
            return frame_map[max(0, min(idx, n - 1))]

        phases = {
            "run_up": {
                "start_frame": frame_map[0],
                "end_frame": safe_frame(bound_idx),
                "start_time": frame_map[0] / fps,
                "end_time": safe_frame(bound_idx) / fps,
            },
            "bound": {
                "start_frame": safe_frame(bound_idx),
                "end_frame": safe_frame(bfc_idx),
                "start_time": safe_frame(bound_idx) / fps,
                "end_time": safe_frame(bfc_idx) / fps,
            },
            "back_foot_contact": {
                "start_frame": safe_frame(bfc_idx),
                "end_frame": safe_frame(ffc_idx),
                "start_time": safe_frame(bfc_idx) / fps,
                "end_time": safe_frame(ffc_idx) / fps,
            },
            "front_foot_contact": {
                "start_frame": safe_frame(ffc_idx),
                "end_frame": safe_frame(delivery_idx),
                "start_time": safe_frame(ffc_idx) / fps,
                "end_time": safe_frame(delivery_idx) / fps,
            },
            "delivery": {
                "start_frame": safe_frame(delivery_idx),
                "end_frame": safe_frame(follow_through_idx),
                "start_time": safe_frame(delivery_idx) / fps,
                "end_time": safe_frame(follow_through_idx) / fps,
            },
            "follow_through": {
                "start_frame": safe_frame(follow_through_idx),
                "end_frame": frame_map[-1],
                "start_time": safe_frame(follow_through_idx) / fps,
                "end_time": frame_map[-1] / fps,
            },
        }

        return phases
