from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from typing import Optional, List
from datetime import datetime, timedelta

from schemas import User, UserProfile, Prediction
from models import UserCreate, ProfileUpdate, PredictionCreate, PredictionUpdate
from auth import get_password_hash, verify_password

# ============================================================================
# User CRUD Operations
# ============================================================================

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get a user by email address"""
    return db.query(User).filter(User.email == email).first()

def get_user_by_username(db: Session, username: str) -> Optional[User]:
    """Get a user by username"""
    return db.query(User).filter(User.username == username).first()

def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    """Get a user by ID"""
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user: UserCreate) -> User:
    """
    Create a new user with hashed password.
    Also creates an empty profile for the user.
    """
    # Create user
    db_user = User(
        email=user.email,
        username=user.username,
        hashed_password=get_password_hash(user.password)
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    # Create empty profile for user
    db_profile = UserProfile(user_id=db_user.id)
    db.add(db_profile)
    db.commit()
    
    return db_user

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """Authenticate a user by email and password"""
    user = get_user_by_email(db, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

# ============================================================================
# User Profile CRUD Operations
# ============================================================================

def get_user_profile(db: Session, user_id: int) -> Optional[UserProfile]:
    """Get user profile by user ID"""
    return db.query(UserProfile).filter(UserProfile.user_id == user_id).first()

def update_user_profile(db: Session, user_id: int, profile: ProfileUpdate) -> UserProfile:
    """Update user profile"""
    db_profile = get_user_profile(db, user_id)
    
    if not db_profile:
        # Create profile if it doesn't exist
        db_profile = UserProfile(user_id=user_id)
        db.add(db_profile)
    
    # Update fields
    update_data = profile.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_profile, field, value)
    
    db_profile.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_profile)
    
    return db_profile

# ============================================================================
# Prediction CRUD Operations
# ============================================================================

def create_prediction(db: Session, user_id: int, prediction: PredictionCreate) -> Prediction:
    """Create a new prediction"""
    db_prediction = Prediction(
        user_id=user_id,
        **prediction.model_dump()
    )
    db.add(db_prediction)
    db.commit()
    db.refresh(db_prediction)
    return db_prediction

def get_prediction_by_id(db: Session, prediction_id: int, user_id: int) -> Optional[Prediction]:
    """Get a specific prediction by ID (only if it belongs to the user)"""
    return db.query(Prediction).filter(
        Prediction.id == prediction_id,
        Prediction.user_id == user_id
    ).first()

def get_user_predictions(
    db: Session,
    user_id: int,
    skip: int = 0,
    limit: int = 100,
    sort_by: str = "created_at",
    order: str = "desc"
) -> List[Prediction]:
    """Get all predictions for a user with pagination and sorting"""
    query = db.query(Prediction).filter(Prediction.user_id == user_id)
    
    # Apply sorting
    if order == "desc":
        query = query.order_by(getattr(Prediction, sort_by).desc())
    else:
        query = query.order_by(getattr(Prediction, sort_by).asc())
    
    return query.offset(skip).limit(limit).all()

def update_prediction(
    db: Session,
    prediction_id: int,
    user_id: int,
    prediction_update: PredictionUpdate
) -> Optional[Prediction]:
    """Update a prediction (notes, symptoms, location)"""
    db_prediction = get_prediction_by_id(db, prediction_id, user_id)
    
    if not db_prediction:
        return None
    
    # Update fields
    update_data = prediction_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_prediction, field, value)
    
    db_prediction.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(db_prediction)
    
    return db_prediction

def delete_prediction(db: Session, prediction_id: int, user_id: int) -> bool:
    """Delete a prediction"""
    db_prediction = get_prediction_by_id(db, prediction_id, user_id)
    
    if not db_prediction:
        return False
    
    db.delete(db_prediction)
    db.commit()
    return True

def get_prediction_count(db: Session, user_id: int) -> int:
    """Get total number of predictions for a user"""
    return db.query(Prediction).filter(Prediction.user_id == user_id).count()

# ============================================================================
# Statistics Operations
# ============================================================================

def get_user_statistics(db: Session, user_id: int) -> dict:
    """Calculate statistics for a user's predictions"""
    predictions = db.query(Prediction).filter(Prediction.user_id == user_id).all()
    
    if not predictions:
        return {
            "total_predictions": 0,
            "high_confidence": 0,
            "medium_confidence": 0,
            "low_confidence": 0,
            "avg_confidence": 0.0,
            "most_common_disease": "None",
            "predictions_this_month": 0,
            "predictions_this_week": 0
        }
    
    # Calculate confidence levels
    high_conf = sum(1 for p in predictions if p.confidence >= 0.9)
    medium_conf = sum(1 for p in predictions if 0.7 <= p.confidence < 0.9)
    low_conf = sum(1 for p in predictions if p.confidence < 0.7)
    
    # Calculate average confidence
    avg_conf = sum(p.confidence for p in predictions) / len(predictions)
    
    # Find most common disease
    disease_counts = {}
    for p in predictions:
        disease_counts[p.prediction] = disease_counts.get(p.prediction, 0) + 1
    
    most_common = max(disease_counts.items(), key=lambda x: x[1])[0] if disease_counts else "None"
    
    # Calculate time-based statistics
    now = datetime.utcnow()
    week_ago = now - timedelta(days=7)
    month_ago = now - timedelta(days=30)
    
    predictions_this_week = sum(1 for p in predictions if p.created_at >= week_ago)
    predictions_this_month = sum(1 for p in predictions if p.created_at >= month_ago)
    
    return {
        "total_predictions": len(predictions),
        "high_confidence": high_conf,
        "medium_confidence": medium_conf,
        "low_confidence": low_conf,
        "avg_confidence": round(avg_conf, 3),
        "most_common_disease": most_common,
        "predictions_this_month": predictions_this_month,
        "predictions_this_week": predictions_this_week
    }

def get_recommendations(db: Session, user_id: int) -> List[dict]:
    """Generate personalized recommendations based on user profile and history"""
    profile = get_user_profile(db, user_id)
    predictions = get_user_predictions(db, user_id, limit=100)
    
    recommendations = []
    
    if not profile:
        recommendations.append({
            "category": "Profile",
            "tip": "Complete your profile for personalized recommendations",
            "icon": "📋"
        })
        return recommendations
    
    # Age-based recommendations
    if profile.age_range == "18-25":
        recommendations.append({
            "category": "Prevention",
            "tip": "Focus on sun protection and establish a good skincare routine early",
            "icon": "🌞"
        })
    elif profile.age_range in ["46-60", "60+"]:
        recommendations.append({
            "category": "Anti-Aging",
            "tip": "Focus on hydration, collagen support, and professional treatments",
            "icon": "🌟"
        })
    
    # Skin type recommendations
    if profile.skin_type == "Oily":
        recommendations.append({
            "category": "Skin Care",
            "tip": "Use oil-free, non-comedogenic products and salicylic acid cleansers",
            "icon": "🧴"
        })
    elif profile.skin_type == "Dry":
        recommendations.append({
            "category": "Skin Care",
            "tip": "Use rich moisturizers with hyaluronic acid and ceramides",
            "icon": "💧"
        })
    
    # Sun exposure recommendations
    if profile.sun_exposure == "High":
        recommendations.append({
            "category": "Protection",
            "tip": "Use SPF 50+ daily and reapply every 2 hours when outdoors",
            "icon": "☀️"
        })
    
    # History-based recommendations
    acne_count = sum(1 for p in predictions if "acne" in p.prediction.lower())
    if acne_count >= 3:
        recommendations.append({
            "category": "Consultation",
            "tip": "Recurring acne detected - consider consulting a dermatologist",
            "icon": "👨‍⚕️"
        })
    
    # Allergy warning
    if profile.has_allergies:
        recommendations.append({
            "category": "Safety",
            "tip": "Always patch test new products before full application",
            "icon": "⚠️"
        })
    
    return recommendations
