from fastapi import APIRouter, Depends, HTTPException, status, File, UploadFile, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import os
import uuid
from pathlib import Path

from database import get_db
from models import PredictionResponse, PredictionCreate, PredictionUpdate
from auth import get_current_user
from crud import (
    create_prediction, get_user_predictions, get_prediction_by_id,
    update_prediction, delete_prediction, get_prediction_count
)
from schemas import User

router = APIRouter(
    prefix="/predictions",
    tags=["Predictions"]
)

# Upload directory
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
Path(UPLOAD_DIR).mkdir(parents=True, exist_ok=True)

@router.post("/", response_model=PredictionResponse, status_code=status.HTTP_201_CREATED)
async def create_new_prediction(
    prediction: PredictionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new prediction record.
    
    This endpoint saves a prediction result to the database.
    The image should already be uploaded and the path provided.
    """
    db_prediction = create_prediction(db, current_user.id, prediction)
    return db_prediction

@router.get("/", response_model=List[PredictionResponse])
async def get_predictions(
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=500, description="Maximum number of records to return"),
    sort_by: str = Query("created_at", description="Field to sort by"),
    order: str = Query("desc", regex="^(asc|desc)$", description="Sort order"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all predictions for the current user.
    
    Supports pagination and sorting.
    """
    predictions = get_user_predictions(
        db,
        current_user.id,
        skip=skip,
        limit=limit,
        sort_by=sort_by,
        order=order
    )
    return predictions

@router.get("/count")
async def get_predictions_count(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get total count of predictions for the current user"""
    count = get_prediction_count(db, current_user.id)
    return {"count": count}

@router.get("/{prediction_id}", response_model=PredictionResponse)
async def get_prediction(
    prediction_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get a specific prediction by ID.
    
    Only returns predictions that belong to the current user.
    """
    prediction = get_prediction_by_id(db, prediction_id, current_user.id)
    
    if not prediction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prediction not found"
        )
    
    return prediction

@router.put("/{prediction_id}", response_model=PredictionResponse)
async def update_prediction_notes(
    prediction_id: int,
    prediction_update: PredictionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update a prediction's notes, symptoms, or location.
    
    Only the owner of the prediction can update it.
    """
    updated_prediction = update_prediction(
        db,
        prediction_id,
        current_user.id,
        prediction_update
    )
    
    if not updated_prediction:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prediction not found"
        )
    
    return updated_prediction

@router.delete("/{prediction_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_prediction_record(
    prediction_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Delete a prediction.
    
    Only the owner of the prediction can delete it.
    """
    success = delete_prediction(db, prediction_id, current_user.id)
    
    if not success:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prediction not found"
        )
    
    return None

@router.post("/upload-image")
async def upload_prediction_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user)
):
    """
    Upload an image for a prediction.
    
    Returns the file path that can be used when creating a prediction.
    """
    # Validate file type
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Invalid file type: {file.content_type}. Only JPG and PNG are supported."
        )
    
    # Generate unique filename
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    # Save file
    try:
        contents = await file.read()
        with open(file_path, "wb") as f:
            f.write(contents)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file: {str(e)}"
        )
    
    return {
        "filename": unique_filename,
        "path": file_path,
        "original_filename": file.filename
    }
