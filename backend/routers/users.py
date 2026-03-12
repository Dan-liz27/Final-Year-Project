from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from models import ProfileResponse, ProfileUpdate, UserStats, RecommendationsResponse
from auth import get_current_user
from crud import get_user_profile, update_user_profile, get_user_statistics, get_recommendations
from schemas import User

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/profile", response_model=ProfileResponse)
async def get_profile(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get the current user's profile.
    
    Returns all profile information including demographics, skin profile,
    medical context, and lifestyle information.
    """
    profile = get_user_profile(db, current_user.id)
    
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )
    
    return profile

@router.put("/profile", response_model=ProfileResponse)
async def update_profile(
    profile_update: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update the current user's profile.
    
    All fields are optional. Only provided fields will be updated.
    """
    updated_profile = update_user_profile(db, current_user.id, profile_update)
    return updated_profile

@router.get("/stats", response_model=UserStats)
async def get_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get statistics about the user's predictions.
    
    Includes:
    - Total predictions
    - Confidence level distribution
    - Average confidence
    - Most common disease
    - Time-based statistics
    """
    stats = get_user_statistics(db, current_user.id)
    return stats

@router.get("/recommendations", response_model=RecommendationsResponse)
async def get_user_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get personalized recommendations based on user profile and prediction history.
    
    Recommendations are generated based on:
    - Age range
    - Skin type
    - Sun exposure
    - Prediction history patterns
    - Medical conditions
    """
    recommendations = get_recommendations(db, current_user.id)
    return {"recommendations": recommendations}


@router.post("/complete-onboarding")
async def complete_onboarding(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Mark onboarding tutorial as completed for the current user"""
    from datetime import datetime
    
    profile = get_user_profile(db, current_user.id)
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
    
    profile.onboarding_completed = True
    profile.onboarding_completed_at = datetime.utcnow()
    db.commit()
    db.refresh(profile)
    
    return {
        "message": "Onboarding completed successfully",
        "completed_at": profile.onboarding_completed_at
    }

