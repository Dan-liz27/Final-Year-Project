from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import numpy as np
from PIL import Image
import io
import time
import os
from pathlib import Path
from dotenv import load_dotenv

from model_utils import predict, load_model
from database import init_db
from routers import auth, users, predictions
from utils.image_validator import check_image_quality

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Skin Disease Classifier API",
    description="API for skin disease classification using CE-EEN-B0 model with user management",
    version="2.0.0"
)

# CORS origins from environment
cors_origins = os.getenv("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173").split(",")

# Add CORS middleware with explicit configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for testing
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,  # Cache preflight requests for 1 hour
)

# Create uploads directory
UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
Path(UPLOAD_DIR).mkdir(parents=True, exist_ok=True)

# Mount uploads directory for serving images
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Include routers
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(predictions.router)

# Add exception handler to ensure CORS headers are sent even on errors
from fastapi.responses import JSONResponse
from fastapi import Request

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers={
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Methods": "*",
            "Access-Control-Allow-Headers": "*",
        }
    )

# Load model on startup
@app.on_event("startup")
async def startup_event():
    """Load model and initialize database when server starts"""
    print("=" * 70)
    print("🚀 Starting Skin Disease Classifier API v2.0")
    print("=" * 70)
    
    # Initialize database
    print("📊 Initializing database...")
    init_db()
    print("✓ Database initialized")
    
    # Load ML model
    print("🤖 Loading ML model...")
    load_model()
    print("✓ ML model loaded")
    
    print("=" * 70)
    print("✓ Server ready to accept requests")
    print("=" * 70)

# Response models
class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    top_predictions: list
    processing_time: float

class HealthResponse(BaseModel):
    status: str
    message: str

# Routes
@app.get("/", response_model=dict)
async def root():
    """Root endpoint"""
    return {
        "message": "Skin Disease Classifier API",
        "version": "1.0.0",
        "endpoints": {
            "/health": "Health check",
            "/predict": "POST - Image prediction",
            "/classes": "GET - List all classes"
        }
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    """Health check endpoint"""
    try:
        model, classes = load_model()
        return {
            "status": "healthy",
            "message": f"Model loaded with {len(classes)} classes"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")

@app.get("/classes", response_model=dict)
async def get_classes():
    """Get all disease classes"""
    try:
        _, class_names = load_model()
        return {
            "total": len(class_names),
            "classes": class_names.tolist()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get classes: {str(e)}")

@app.post("/predict", response_model=PredictionResponse)
async def predict_image(file: UploadFile = File(...)):
    """
    Predict skin disease from uploaded image.
    
    - **file**: Image file (JPG, PNG)
    - Returns: Prediction with confidence scores
    """
    start_time = time.time()
    
    try:
        # Validate file type
        if file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid file type: {file.content_type}. Only JPG and PNG are supported."
            )
        
        # Read image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        
        # Convert to RGB if needed
        if image.mode != "RGB":
            image = image.convert("RGB")
        
        # Convert to numpy array
        img_array = np.array(image)
        
        # Validate image
        if img_array.size == 0:
            raise HTTPException(status_code=400, detail="Empty or invalid image")
        
        # Make prediction
        result = predict(img_array)
        
        # Calculate processing time
        processing_time = time.time() - start_time
        
        return {
            **result,
            "processing_time": round(processing_time, 3)
        }
    
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/api/validate-image")
async def validate_image_quality(file: UploadFile = File(...)):
    """
    Validate image quality before prediction.
    
    Checks resolution, sharpness, brightness, and contrast.
    Returns quality score and recommendations.
    """
    try:
        print(f"Validating image: {file.filename}, content_type: {file.content_type}")
        
        # Read image bytes
        contents = await file.read()
        print(f"Image size: {len(contents)} bytes")
        
        # Validate image quality
        quality_report = check_image_quality(contents)
        print(f"Quality check successful: {quality_report['overall_score']}%")
        
        return quality_report
    
    except ValueError as e:
        print(f"ValueError in image validation: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        print(f"Exception in image validation: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Image validation failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
