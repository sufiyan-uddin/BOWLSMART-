"""
AI Report Generator — uses Google Gemini API to generate natural language
bowling analysis reports from structured biomechanics data.

Includes a robust fallback that generates a complete report from the
biomechanics data directly, so the app works even without a Gemini API key.
"""

import json
from app.config import settings


class ReportGenerator:
    """Generates AI-powered bowling analysis reports using Gemini."""

    SYSTEM_PROMPT = """You are Dr. BowlSmart, an elite cricket biomechanics analyst with 20+ years of 
experience coaching fast bowlers at international level. You combine deep sports 
science knowledge with the ability to explain complex concepts in plain English 
that any bowler can understand.

Your analysis style:
- Be encouraging but honest
- Use cricket-specific language naturally
- Explain the WHY behind every observation
- Connect biomechanics to real bowling outcomes (pace, accuracy, injury)
- Reference elite bowler comparisons where helpful
- Never use medical jargon without explanation
- Always prioritize safety — flag dangerous mechanics clearly
- Use analogies that make complex biomechanics easy to visualize
"""

    async def generate_report(
        self,
        bowler_profile: dict,
        biomechanics: dict,
        phase_scores: dict,
        overall_score: int,
        injury_risk: dict,
        pace_leaks: list,
        max_pace_potential: float,
    ) -> dict:
        """Generate a complete bowling analysis report. Tries Gemini first, falls back to rule-based."""

        # Try Gemini API if key is available
        if settings.GEMINI_API_KEY:
            try:
                return await self._generate_with_gemini(
                    bowler_profile, biomechanics, phase_scores,
                    overall_score, injury_risk, pace_leaks, max_pace_potential,
                )
            except Exception as e:
                print(f"Gemini API failed: {e}. Using fallback report generator.")

        # Fallback: generate report from biomechanics data directly
        return self._generate_fallback_report(
            bowler_profile, biomechanics, phase_scores,
            overall_score, injury_risk, pace_leaks, max_pace_potential,
        )

    async def _generate_with_gemini(
        self,
        bowler_profile: dict,
        biomechanics: dict,
        phase_scores: dict,
        overall_score: int,
        injury_risk: dict,
        pace_leaks: list,
        max_pace_potential: float,
    ) -> dict:
        """Generate report using Google Gemini API."""
        import google.generativeai as genai

        genai.configure(api_key=settings.GEMINI_API_KEY)
        model = genai.GenerativeModel("gemini-1.5-pro")

        user_prompt = f"""Analyze this fast bowler's action based on the following biomechanical data.

BOWLER PROFILE:
{json.dumps(bowler_profile, indent=2)}

OVERALL FORM SCORE: {overall_score}/100

PHASE SCORES:
{json.dumps(phase_scores, indent=2)}

BIOMECHANICAL ANALYSIS DATA:
{json.dumps(biomechanics, indent=2, default=str)}

INJURY RISK DATA:
{json.dumps(injury_risk, indent=2)}

IDENTIFIED PACE LEAKS:
{json.dumps(pace_leaks, indent=2)}

ESTIMATED MAX PACE POTENTIAL: {max_pace_potential} km/h

Generate a complete bowling analysis report. Return your response as JSON with these exact keys:

{{
  "executive_summary": "2-3 sentence overall impression",
  "phase_analysis": [
    {{
      "phase_name": "Run-Up",
      "score": 8,
      "whats_working": "description",
      "needs_improvement": "description", 
      "coaching_cue": "one memorable sentence"
    }}
  ],
  "pace_leak_insights": [
    {{
      "rank": 1,
      "issue": "name",
      "biomechanical_explanation": "what's happening",
      "pace_cost_kmh": "X-Y",
      "fix_instruction": "actionable instruction",
      "elite_comparison": "optional pro bowler comparison"
    }}
  ],
  "injury_risk_summary": {{
    "overall_assessment": "paragraph explaining risk profile",
    "critical_areas": [
      {{
        "body_area": "Lower Back",
        "risk_score": 42,
        "plain_english_explanation": "explanation",
        "prevention_action": "what to do"
      }}
    ]
  }},
  "action_plan": [
    {{
      "priority": 1,
      "what_to_do": "specific action",
      "why_it_matters": "impact",
      "expected_timeline": "timeline"
    }}
  ],
  "recommended_drills": [
    {{
      "name": "drill name",
      "purpose": "what it fixes",
      "target_area": "area",
      "sets_reps": "3 x 10 reps",
      "coaching_cues": ["cue 1", "cue 2"],
      "category": "pace / body_mechanics / strength / recovery"
    }}
  ],
  "motivational_note": "encouraging paragraph"
}}

Return ONLY the JSON, no markdown formatting or code blocks."""

        response = model.generate_content(
            [
                {"role": "user", "parts": [self.SYSTEM_PROMPT]},
                {"role": "model", "parts": ["I understand. I'm Dr. BowlSmart, ready to analyze."]},
                {"role": "user", "parts": [user_prompt]},
            ],
            generation_config=genai.GenerationConfig(
                temperature=0.7,
                max_output_tokens=4096,
            ),
        )

        response_text = response.text.strip()

        # Clean up potential markdown code blocks
        if response_text.startswith("```"):
            response_text = response_text.split("\n", 1)[1]
        if response_text.endswith("```"):
            response_text = response_text.rsplit("```", 1)[0]
        response_text = response_text.strip()

        return json.loads(response_text)

    def _generate_fallback_report(
        self,
        bowler_profile: dict,
        biomechanics: dict,
        phase_scores: dict,
        overall_score: int,
        injury_risk: dict,
        pace_leaks: list,
        max_pace_potential: float,
    ) -> dict:
        """Generate a complete report using rule-based analysis when Gemini is unavailable."""

        current_pace = bowler_profile.get("self_reported_pace") or 125
        name = bowler_profile.get("full_name", "Bowler")

        # Build executive summary
        if overall_score >= 80:
            summary = f"Excellent bowling action with a form score of {overall_score}/100. Your technique is well above average with strong fundamentals across all phases."
        elif overall_score >= 65:
            summary = f"Good foundation with a form score of {overall_score}/100. You have solid fundamentals but there are clear areas where targeted work can unlock significantly more pace."
        elif overall_score >= 50:
            summary = f"Developing action with a form score of {overall_score}/100. There are several key areas that need attention — fixing them could add 10-15 km/h to your bowling."
        else:
            summary = f"Your form score is {overall_score}/100. While there's significant room for improvement, that's actually exciting — it means there's a lot of untapped pace waiting to be unlocked."

        if pace_leaks:
            top_leak = pace_leaks[0]
            summary += f" Your biggest opportunity is addressing {top_leak['issue'].lower()}, which is costing you an estimated {top_leak['pace_impact_kmh']} km/h."

        # Build phase analysis
        phase_names = {
            "run_up": "Run-Up",
            "bound": "Bound/Gather",
            "back_foot_contact": "Back-Foot Contact",
            "front_foot_contact": "Front-Foot Contact",
            "delivery": "Delivery Stride",
            "follow_through": "Follow-Through",
        }

        phase_analysis = []
        for phase_key, display_name in phase_names.items():
            ps = phase_scores.get(phase_key, {})
            score = ps.get("score", 7)
            metric = ps.get("key_metric", "")

            if score >= 8:
                working = f"Strong {display_name.lower()} phase. {metric}"
                improve = "Minor refinements possible but this phase is working well."
                cue = self._get_positive_cue(phase_key)
            elif score >= 6:
                working = f"Decent {display_name.lower()} with room for improvement. {metric}"
                improve = self._get_improvement_note(phase_key, biomechanics)
                cue = self._get_improvement_cue(phase_key)
            else:
                working = f"This phase needs significant attention. {metric}"
                improve = self._get_improvement_note(phase_key, biomechanics)
                cue = self._get_improvement_cue(phase_key)

            phase_analysis.append({
                "phase_name": display_name,
                "score": score,
                "whats_working": working,
                "needs_improvement": improve,
                "coaching_cue": cue,
            })

        # Build pace leak insights
        pace_leak_insights = []
        for leak in pace_leaks:
            pace_leak_insights.append({
                "rank": leak.get("rank", 1),
                "issue": leak["issue"],
                "biomechanical_explanation": leak["description"],
                "pace_cost_kmh": leak["pace_impact_kmh"],
                "fix_instruction": leak["fix"],
                "elite_comparison": self._get_elite_comparison(leak["issue"]),
            })

        # Build injury risk summary
        body_areas = injury_risk.get("body_areas", {})
        critical_areas = []
        area_display = {
            "lower_back": "Lower Back",
            "front_knee": "Front Knee",
            "bowling_shoulder": "Bowling Shoulder",
            "ankle": "Ankle",
            "elbow": "Elbow",
        }
        area_explanations = injury_risk.get("explanations", {})

        for area_key, area_data in body_areas.items():
            if area_data.get("risk", 0) > 20:
                critical_areas.append({
                    "body_area": area_display.get(area_key, area_key),
                    "risk_score": area_data["risk"],
                    "plain_english_explanation": self._get_area_explanation(area_key, area_data, biomechanics),
                    "prevention_action": self._get_prevention_action(area_key),
                })

        risk_level = injury_risk.get("risk_level", "Moderate")
        overall_risk = injury_risk.get("overall_risk", 35)
        risk_assessment = f"Your overall injury risk score is {overall_risk}/100 ({risk_level}). "
        if risk_level == "Low":
            risk_assessment += "Your bowling action is biomechanically sound and you're at low risk of common fast bowling injuries. Keep up the good work with your recovery routine."
        elif risk_level == "Moderate":
            risk_assessment += "There are some areas to monitor, particularly around the lower back and front knee. With targeted strengthening and technique work, these risks can be reduced."
        else:
            risk_assessment += "There are significant risk factors that should be addressed. Consider working with a physiotherapist alongside your technique improvements."

        # Build action plan
        action_plan = []
        priority = 1
        for leak in pace_leaks[:3]:
            action_plan.append({
                "priority": priority,
                "what_to_do": f"Fix {leak['issue']}",
                "why_it_matters": f"This is costing you {leak['pace_impact_kmh']} km/h and may increase injury risk.",
                "expected_timeline": "2-4 weeks of focused practice",
            })
            priority += 1

        # Recommended drills
        recommended_drills = self._get_recommended_drills(biomechanics, pace_leaks)

        # Motivational note
        motivational = (
            f"You're currently bowling at around {current_pace} km/h, and our analysis shows you have the "
            f"potential to reach {max_pace_potential} km/h. That's {max_pace_potential - current_pace:.0f} km/h "
            f"of hidden pace waiting to be unlocked! The improvements we've identified are all achievable "
            f"with consistent, focused practice. Every elite fast bowler started where you are — the "
            f"difference is they committed to the process. Let's get to work! 🏏"
        )

        return {
            "executive_summary": summary,
            "phase_analysis": phase_analysis,
            "pace_leak_insights": pace_leak_insights,
            "injury_risk_summary": {
                "overall_assessment": risk_assessment,
                "critical_areas": critical_areas,
            },
            "action_plan": action_plan,
            "recommended_drills": recommended_drills,
            "motivational_note": motivational,
        }

    def _get_positive_cue(self, phase: str) -> str:
        cues = {
            "run_up": "Build speed like a plane on a runway — smooth acceleration, peak at takeoff.",
            "bound": "Think 'gather and explode' — coil your energy in the bound.",
            "back_foot_contact": "Stay side-on, load the slingshot.",
            "front_foot_contact": "Brace that front leg like a steel pole!",
            "delivery": "Drive the arm through fast and high.",
            "follow_through": "Let your body flow through naturally — don't fight the momentum.",
        }
        return cues.get(phase, "Focus on smooth, repeatable mechanics.")

    def _get_improvement_cue(self, phase: str) -> str:
        cues = {
            "run_up": "Last 3 strides should be your FASTEST — build, build, explode!",
            "bound": "Get taller in the gather — think 'jump up, not just forward'.",
            "back_foot_contact": "Keep your front shoulder pointing at the batsman as long as possible.",
            "front_foot_contact": "Lock that front knee! Think 'brace and catapult'.",
            "delivery": "Pull your front arm DOWN to your hip — that pulls the bowling arm THROUGH.",
            "follow_through": "Let your back leg swing past naturally — don't plant and stop.",
        }
        return cues.get(phase, "Focus on the fundamentals of this phase.")

    def _get_improvement_note(self, phase: str, biomechanics: dict) -> str:
        notes = {
            "run_up": "Focus on building speed progressively. Your last 3 strides should be your fastest.",
            "bound": "Work on getting more elevation in your gather step to increase momentum.",
            "back_foot_contact": "Improve your hip-shoulder separation to generate more rotational power.",
            "front_foot_contact": "Strengthen your front leg bracing to prevent energy loss at landing.",
            "delivery": "Work on front arm drive and release point consistency.",
            "follow_through": "Allow a more complete follow-through to reduce deceleration stress.",
        }
        return notes.get(phase, "Continue developing this phase of your action.")

    def _get_elite_comparison(self, issue: str) -> str:
        comps = {
            "Front Knee Collapse": "Watch Dale Steyn's front leg at delivery — it stays completely straight like a steel rod, transferring all the energy upward.",
            "Insufficient Torso Coil": "Mitchell Starc has exceptional hip-shoulder separation — his shoulders lag behind his hips, creating a massive 'slingshot' effect.",
            "Decelerating Run-Up": "Pat Cummins has one of the smoothest accelerating run-ups in cricket — watch how he peaks in the last three strides.",
            "Excessive Side Bend": "Jasprit Bumrah, despite his unusual action, maintains excellent trunk control through delivery.",
            "Short Stride": "Glenn McGrath's stride was perfectly proportioned to his height, giving him the ideal release point.",
        }
        return comps.get(issue, "Study the elite bowlers who excel in this area for visual reference.")

    def _get_area_explanation(self, area: str, area_data: dict, biomechanics: dict) -> str:
        risk = area_data.get("risk", 0)
        explanations = {
            "lower_back": f"Your lower back risk score is {risk}/100. Fast bowling puts huge stress on the spine, especially with lateral flexion and mixed actions. Strengthening your core is essential.",
            "front_knee": f"Front knee risk at {risk}/100. Repeated impact from landing on your front foot can stress the patellar tendon. Strong quads and bracing technique are your best protection.",
            "bowling_shoulder": f"Bowling shoulder risk at {risk}/100. The rapid rotation through delivery stresses the rotator cuff. Shoulder stability exercises are important.",
            "ankle": f"Ankle risk at {risk}/100. The front foot absorbs significant force at landing. Proper footwear and ankle mobility work help.",
            "elbow": f"Elbow risk at {risk}/100. Keep monitoring your bowling arm extension through delivery.",
        }
        return explanations.get(area, f"Risk score: {risk}/100. Monitor this area and strengthen as needed.")

    def _get_prevention_action(self, area: str) -> str:
        actions = {
            "lower_back": "Core strengthening (planks, dead bugs, bird dogs), thoracic mobility work, and monitoring bowling workload.",
            "front_knee": "Quad strengthening (single-leg squats, wall sits), bracing drill practice, and proper warm-up.",
            "bowling_shoulder": "Rotator cuff exercises (external rotations with band), shoulder stability work.",
            "ankle": "Ankle mobility exercises, proper cricket shoes, balance board work.",
            "elbow": "Bowling arm straightening drills, monitoring elbow extension in practice.",
        }
        return actions.get(area, "Consult a physiotherapist for specific exercises.")

    def _get_recommended_drills(self, biomechanics: dict, pace_leaks: list) -> list:
        """Generate drill recommendations based on the biomechanics analysis."""
        drills = []

        # Check for front knee issues
        ffc = biomechanics.get("joint_angles", {}).get("ffc", {})
        if ffc.get("front_knee_angle", 180) < 160:
            drills.append({
                "name": "Wall Brace Drill",
                "purpose": "Build front leg strength and bracing habit",
                "target_area": "Front Knee",
                "sets_reps": "3 × 10 reps",
                "coaching_cues": [
                    "Stand arm's length from a wall, front foot planted",
                    "Drive your hip toward the wall while keeping front knee locked",
                    "Feel the brace in your quad — that's the feeling you want at delivery",
                ],
                "category": "body_mechanics",
            })
            drills.append({
                "name": "Single Leg Squats",
                "purpose": "Strengthen quad for front leg stability",
                "target_area": "Front Knee",
                "sets_reps": "3 × 8 each leg",
                "coaching_cues": [
                    "Control the descent — 3 seconds down",
                    "Keep your knee tracking over your toes",
                    "Drive up powerfully from the bottom",
                ],
                "category": "strength",
            })

        # Check hip-shoulder separation
        bfc_sep = biomechanics.get("body_alignment", {}).get("bfc", {}).get("hip_shoulder_separation", 40)
        if bfc_sep < 35:
            drills.append({
                "name": "Delayed Rotation Bowling",
                "purpose": "Improve hip-shoulder separation timing",
                "target_area": "Hip-Shoulder Separation",
                "sets_reps": "2 × 6 deliveries",
                "coaching_cues": [
                    "Point front shoulder at the batsman at back-foot contact",
                    "Let your hips lead the rotation",
                    "Feel the stretch across your core before you uncoil",
                ],
                "category": "body_mechanics",
            })

        # Front arm drive
        drills.append({
            "name": "Front Arm Pull-Down",
            "purpose": "Train active front arm for faster shoulder rotation",
            "target_area": "Front Arm",
            "sets_reps": "3 × 8 reps",
            "coaching_cues": [
                "Pull your front hand sharply toward your front hip pocket",
                "Think 'rip the shirt' motion",
                "Feel your bowling shoulder accelerate as a result",
            ],
            "category": "pace",
        })

        # Recovery drills
        drills.append({
            "name": "Thoracic Rotation Stretch",
            "purpose": "Improve trunk mobility and reduce lower back stress",
            "target_area": "Lower Back",
            "sets_reps": "2 × 30 seconds each side",
            "coaching_cues": [
                "Keep hips still, rotate only your upper body",
                "Breathe deeply into the stretch",
                "Hold at end range without bouncing",
            ],
            "category": "recovery",
        })

        # Run-up drill
        drills.append({
            "name": "Run-Up Rhythm Builder",
            "purpose": "Develop consistent run-up acceleration",
            "target_area": "Run-Up",
            "sets_reps": "5 × full run-ups (no ball)",
            "coaching_cues": [
                "Start at 60% speed, build to 100% at the crease",
                "Last 3 strides should be your fastest",
                "Hit the crease in balance every time",
            ],
            "category": "pace",
        })

        return drills
