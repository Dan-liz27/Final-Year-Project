import numpy as np
import cv2
import tensorflow as tf
from tensorflow import keras
from pathlib import Path

# Global variables for model and classes
MODEL_PATH = Path(__file__).parent / "models" / "best_model.keras"
CLASSES_PATH = Path(__file__).parent / "models" / "classes.npy"
IMG_SIZE = 180

# Load model and classes once at module import
_model = None
_class_names = None

def load_model():
    """Load the trained model and class names"""
    global _model, _class_names
    
    if _model is None:
        print(f"Loading model from {MODEL_PATH}...")
        _model = keras.models.load_model(str(MODEL_PATH))
        print("✓ Model loaded successfully")
    
    if _class_names is None:
        print(f"Loading class names from {CLASSES_PATH}...")
        _class_names = np.load(str(CLASSES_PATH), allow_pickle=True)
        print(f"✓ Loaded {len(_class_names)} classes")
    
    return _model, _class_names

def extract_contour_and_crop(img_array):
    """
    Extract contour and crop to lesion.
    Same preprocessing as training.
    """
    if img_array is None or img_array.size == 0:
        return np.zeros((IMG_SIZE, IMG_SIZE, 3), dtype=np.uint8)
    
    # Convert to grayscale
    gray = cv2.cvtColor(img_array, cv2.COLOR_RGB2GRAY)
    
    # Gaussian blur
    blur = cv2.GaussianBlur(gray, (5, 5), 0)
    
    # Otsu thresholding
    _, thresh = cv2.threshold(blur, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    
    # Find contours
    contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    
    if not contours:
        return cv2.resize(img_array, (IMG_SIZE, IMG_SIZE))
    
    # Get largest contour
    largest_contour = max(contours, key=cv2.contourArea)
    x, y, w, h = cv2.boundingRect(largest_contour)
    
    # Add 5% margin
    margin = int(0.05 * max(w, h))
    x = max(0, x - margin)
    y = max(0, y - margin)
    w = min(img_array.shape[1] - x, w + 2 * margin)
    h = min(img_array.shape[0] - y, h + 2 * margin)
    
    # Crop and resize
    cropped = img_array[y:y+h, x:x+w]
    resized = cv2.resize(cropped, (IMG_SIZE, IMG_SIZE))
    
    return resized

def preprocess_image(img_array):
    """
    Preprocess image for model prediction.
    
    Args:
        img_array: numpy array of image (RGB)
    
    Returns:
        Preprocessed image ready for model
    """
    # Extract contour and crop
    processed = extract_contour_and_crop(img_array)
    
    # Normalize to [0, 1]
    processed = processed.astype(np.float32) / 255.0
    
    # Add batch dimension
    processed = np.expand_dims(processed, axis=0)
    
    return processed

def predict(img_array):
    """
    Make prediction on preprocessed image.
    
    Args:
        img_array: numpy array of image (RGB)
    
    Returns:
        dict with prediction results
    """
    print(f"[PREDICT] Starting prediction for image shape: {img_array.shape}")
    model, class_names = load_model()
    
    # Preprocess
    processed_img = preprocess_image(img_array)
    print(f"[PREDICT] Preprocessed image shape: {processed_img.shape}")
    
    # Predict
    predictions = model.predict(processed_img, verbose=0)
    print(f"[PREDICT] Raw predictions shape: {predictions.shape}")
    print(f"[PREDICT] Prediction values (first 5): {predictions[0][:5]}")
    
    # Get top prediction
    top_idx = np.argmax(predictions[0])
    top_class = class_names[top_idx]
    top_confidence = float(predictions[0][top_idx])
    
    print(f"[PREDICT] Top prediction: {top_class} (confidence: {top_confidence:.4f})")
    
    # Get top 3 predictions
    top_3_indices = np.argsort(predictions[0])[-3:][::-1]
    top_3_predictions = [
        {
            "class": class_names[idx],
            "confidence": float(predictions[0][idx])
        }
        for idx in top_3_indices
    ]
    
    print(f"[PREDICT] Top 3: {[f'{p['class']}: {p['confidence']:.4f}' for p in top_3_predictions]}")
    
    return {
        "prediction": top_class,
        "confidence": top_confidence,
        "top_predictions": top_3_predictions
    }
