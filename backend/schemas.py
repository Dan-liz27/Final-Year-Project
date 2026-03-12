from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    """User model for authentication and profile management"""
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)

    # Relationships
    profile = relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    predictions = relationship("Prediction", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User(id={self.id}, username={self.username}, email={self.email})>"


class UserProfile(Base):
    """User profile model for storing demographic and skin information"""
    __tablename__ = "user_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), unique=True, nullable=False)

    # Demographics
    age_range = Column(String, nullable=True)
    gender = Column(String, nullable=True)
    location = Column(String, nullable=True)

    # Skin Profile
    skin_type = Column(String, nullable=True)
    skin_tone = Column(String, nullable=True)
    main_concerns = Column(JSON, nullable=True)

    # Medical Context
    has_allergies = Column(Boolean, default=False)
    allergy_details = Column(Text, nullable=True)
    on_medication = Column(Boolean, default=False)
    medication_details = Column(Text, nullable=True)
    previous_conditions = Column(JSON, nullable=True)
    family_history = Column(JSON, nullable=True)

    # Lifestyle
    sun_exposure = Column(String, nullable=True)
    skincare_level = Column(String, nullable=True)

    # Settings
    confidence_threshold = Column(Integer, default=70)
    view_mode = Column(String, default="grid")

    # Onboarding
    onboarding_completed = Column(Boolean, default=False)
    onboarding_completed_at = Column(DateTime, nullable=True)

    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="profile")

    def __repr__(self):
        return f"<UserProfile(user_id={self.user_id}, skin_type={self.skin_type})>"


class Prediction(Base):
    """Prediction model for storing skin disease classification results"""
    __tablename__ = "predictions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Prediction Data
    image_path = Column(String, nullable=False)
    prediction = Column(String, nullable=False)
    confidence = Column(Float, nullable=False)
    top_predictions = Column(JSON, nullable=False)
    processing_time = Column(Float, nullable=True)

    # Metadata
    image_metadata = Column(JSON, nullable=True)
    user_notes = Column(Text, nullable=True)
    symptoms = Column(JSON, nullable=True)
    location_on_body = Column(String, nullable=True)

    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow, index=True)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="predictions")

    def __repr__(self):
        return f"<Prediction(id={self.id}, user_id={self.user_id}, prediction={self.prediction}, confidence={self.confidence:.2f})>"
