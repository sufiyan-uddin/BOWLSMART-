"""MediaPipe Pose Detection Service — extracts 33 body landmarks per frame."""

import mediapipe as mp
import numpy as np
from scipy.signal import savgol_filter


class PoseDetector:
    """Detects body pose landmarks using MediaPipe Pose."""

    # Key landmark indices (MediaPipe Pose)
    LANDMARKS = {
        "nose": 0,
        "left_shoulder": 11, "right_shoulder": 12,
        "left_elbow": 13, "right_elbow": 14,
        "left_wrist": 15, "right_wrist": 16,
        "left_hip": 23, "right_hip": 24,
        "left_knee": 25, "right_knee": 26,
        "left_ankle": 27, "right_ankle": 28,
        "left_heel": 29, "right_heel": 30,
        "left_foot_index": 31, "right_foot_index": 32,
    }

    def __init__(self, model_complexity: int = 2, min_confidence: float = 0.5):
        self.model_complexity = model_complexity
        self.min_confidence = min_confidence

    def detect_poses(self, frames: list[np.ndarray]) -> list[dict | None]:
        """
        Process frames through MediaPipe Pose and return landmark sequences.
        
        Returns list of dicts, each containing:
        - landmarks: dict of {name: {x, y, z, visibility}} for each body part
        - raw_landmarks: full 33-point array
        - confidence: average visibility score
        """
        mp_pose = mp.solutions.pose
        results_sequence = []

        with mp_pose.Pose(
            static_image_mode=False,  # video mode for temporal smoothing
            model_complexity=self.model_complexity,
            enable_segmentation=False,
            min_detection_confidence=self.min_confidence,
            min_tracking_confidence=self.min_confidence,
        ) as pose:
            for frame in frames:
                result = pose.process(frame)

                if result.pose_landmarks:
                    landmarks = {}
                    raw = []
                    total_visibility = 0

                    for idx, lm in enumerate(result.pose_landmarks.landmark):
                        raw.append({
                            "x": lm.x,
                            "y": lm.y,
                            "z": lm.z,
                            "visibility": lm.visibility,
                        })
                        total_visibility += lm.visibility

                        # Map named landmarks
                        for name, landmark_idx in self.LANDMARKS.items():
                            if idx == landmark_idx:
                                landmarks[name] = {
                                    "x": lm.x,
                                    "y": lm.y,
                                    "z": lm.z,
                                    "visibility": lm.visibility,
                                }

                    avg_confidence = total_visibility / len(result.pose_landmarks.landmark)
                    results_sequence.append({
                        "landmarks": landmarks,
                        "raw_landmarks": raw,
                        "confidence": avg_confidence,
                    })
                else:
                    results_sequence.append(None)

        return results_sequence

    def smooth_landmarks(
        self, landmarks_sequence: list[dict | None], window_length: int = 7, polyorder: int = 2
    ) -> list[dict | None]:
        """
        Apply Savitzky-Golay smoothing filter to landmark positions.
        This reduces jitter in MediaPipe tracking without losing important movements.
        """
        # Collect valid frames
        valid_indices = [i for i, lm in enumerate(landmarks_sequence) if lm is not None]
        if len(valid_indices) < window_length:
            return landmarks_sequence  # Not enough data to smooth

        # Extract x,y positions for each landmark over time
        landmark_names = list(self.LANDMARKS.keys())
        
        for name in landmark_names:
            xs = []
            ys = []
            for idx in valid_indices:
                lm = landmarks_sequence[idx]
                if lm and name in lm["landmarks"]:
                    xs.append(lm["landmarks"][name]["x"])
                    ys.append(lm["landmarks"][name]["y"])
                else:
                    xs.append(0)
                    ys.append(0)

            if len(xs) >= window_length:
                # Apply smoothing
                smooth_x = savgol_filter(xs, window_length, polyorder)
                smooth_y = savgol_filter(ys, window_length, polyorder)

                # Write back
                for i, idx in enumerate(valid_indices):
                    if landmarks_sequence[idx] and name in landmarks_sequence[idx]["landmarks"]:
                        landmarks_sequence[idx]["landmarks"][name]["x"] = float(smooth_x[i])
                        landmarks_sequence[idx]["landmarks"][name]["y"] = float(smooth_y[i])

        return landmarks_sequence
