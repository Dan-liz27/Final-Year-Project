from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# ============================================================================
# User Schemas
# ============================================================================

class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=100)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    is_active: bool

    class Config:
        from_attributes = True

# ============================================================================
# Token Schemas
# ============================================================================

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    email: Optional[str] = None

# ============================================================================
# User Profile Schemas
# ============================================================================

class ProfileBase(BaseModel):
    age_range: Optional[str] = None
    gender: Optional[str] = None
    location: Optional[str] = None
    skin_type: Optional[str] = None
    skin_tone: Optional[str] = None
    main_concerns: Optional[List[str]] = None
    has_allergies: Optional[bool] = False
    allergy_details: Optional[str] = None
    on_medication: Optional[bool] = False
    medication_details: Optional[str] = None
    previous_conditions: Optional[List[str]] = None
    family_history: Optional[List[str]] = None
    sun_exposure: Optional[str] = None
    skincare_level: Optional[str] = None
    confidence_threshold: Optional[int] = 70
    view_mode: Optional[str] = "grid"
    onboarding_completed: Optional[bool] = None

class ProfileUpdate(ProfileBase):
    pass

class ProfileResponse(ProfileBase):
    id: int
    user_id: int
    updated_at: datetime

    class Config:
        from_attributes = True

# ============================================================================
# Prediction Schemas
# ============================================================================

class PredictionBase(BaseModel):
    prediction: str
    confidence: float
    top_predictions: List[dict]
    processing_time: Optional[float] = None

class PredictionCreate(PredictionBase):
    image_path: str
    image_metadata: Optional[dict] = None
    user_notes: Optional[str] = None
    symptoms: Optional[List[str]] = None
    location_on_body: Optional[str] = None

class PredictionUpdate(BaseModel):
    user_notes: Optional[str] = None
    symptoms: Optional[List[str]] = None
    location_on_body: Optional[str] = None

class PredictionResponse(PredictionBase):
    id: int
    user_id: int
    image_path: str
    image_metadata: Optional[dict] = None
    user_notes: Optional[str] = None
    symptoms: Optional[List[str]] = None
    location_on_body: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# ============================================================================
# Statistics Schemas
# ============================================================================

class UserStats(BaseModel):
    total_predictions: int
    high_confidence: int
    medium_confidence: int
    low_confidence: int
    avg_confidence: float
    most_common_disease: str
    predictions_this_month: int
    predictions_this_week: int

class RecommendationItem(BaseModel):
    category: str
    tip: str
    icon: str

class RecommendationsResponse(BaseModel):
    recommendations: List[RecommendationItem]
