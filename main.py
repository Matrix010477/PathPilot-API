from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field
from typing import List, Tuple, Dict
import logging

# Initialize FastAPI app
app = FastAPI()

# Configure logging for debugging
logging.basicConfig(level=logging.INFO)

# Define the data model for incoming requests
class PredictionRequest(BaseModel):
    skills: List[str] = Field(..., min_items=1, title="List of Skills")
    interests: List[str] = Field(..., min_items=1, title="List of Interests")

@app.get("/")
def read_root():
    return {"message": "FastAPI server is running!"}

@app.post("/predict")
def predict(data: PredictionRequest):
    logging.info(f"Received request: {data}")

    # Ensure valid input
    if not data.skills or not data.interests:
        raise HTTPException(status_code=400, detail="Both skills and interests must be provided.")

    # Career mapping dictionary with multiple skills & interests
    career_map: Dict[str, Tuple[List[str], List[str]]] = {
        "Software Developer": (["javascript", "python", "c++"], ["tech", "programming"]),
        "Machine Learning Engineer": (["python", "r", "tensorflow"], ["ai", "data science"]),
        "Data Analyst": (["data analysis", "sql", "excel"], ["business", "research"]),
        "Digital Marketer": (["marketing", "seo", "content writing"], ["social media", "advertising"]),
        "Cybersecurity Specialist": (["cybersecurity", "networking", "ethical hacking"], ["security", "hacking"]),
        "Financial Analyst": (["finance", "accounting", "statistics"], ["investing", "economics"]),
        "Medical Researcher": (["biology", "chemistry", "genetics"], ["healthcare", "science"]),
        "Food Blogger": (["cooking", "baking", "writing"], ["entertainment", "food", "social media"]),
        "Chef": (["cooking", "baking", "food preparation"], ["culinary", "hospitality"]),
        "Sports Coach": (["sports", "fitness", "training"], ["athletics", "coaching"]),
        "Athlete": (["sports", "strength training", "endurance"], ["competition", "fitness"]),
        "Content Creator": (["video editing", "graphic design", "photography"], ["social media", "entertainment"]),
        "Actor": (["acting", "public speaking", "performance"], ["theatre", "entertainment"]),
    }

    # Normalize input to lowercase for flexible matching
    normalized_skills = set(skill.lower() for skill in data.skills)
    normalized_interests = set(interest.lower() for interest in data.interests)

    # Scoring system: find careers with most skill & interest matches
    career_scores = {}
    for career, (career_skills, career_interests) in career_map.items():
        skill_matches = len(normalized_skills.intersection(set(career_skills)))
        interest_matches = len(normalized_interests.intersection(set(career_interests)))
        total_score = skill_matches + interest_matches
        if total_score > 0:
            career_scores[career] = total_score

    # Sort careers by highest match score
    sorted_careers = sorted(career_scores.items(), key=lambda x: x[1], reverse=True)

    # Return top 3 career suggestions
    if sorted_careers:
        top_careers = [career for career, _ in sorted_careers[:3]]
        return {"career_suggestions": top_careers}

    return {"career": "Unknown"}
