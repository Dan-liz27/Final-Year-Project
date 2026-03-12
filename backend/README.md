# Skin Disease Classifier - Backend

FastAPI backend for skin disease classification using the CE-EEN-B0 model.

## Setup

### 1. Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Verify Model Files

Make sure these files are in the `models/` folder:
- `best_model.keras` (92 MB)
- `classes.npy` (9 KB)

### 3. Run the Server

```bash
python app.py
```

Or using uvicorn directly:
```bash
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

## API Endpoints

### `GET /`
Root endpoint with API information

### `GET /health`
Health check endpoint

**Response:**
```json
{
  "status": "healthy",
  "message": "Model loaded with 34 classes"
}
```

### `GET /classes`
Get all 34 disease classes

**Response:**
```json
{
  "total": 34,
  "classes": ["Acne And Rosacea Photos", "..."]
}
```

### `POST /predict`
Predict skin disease from image

**Request:**
- Content-Type: `multipart/form-data`
- Body: Image file (JPG or PNG)

**Response:**
```json
{
  "prediction": "Melanoma Skin Cancer Nevi And Moles",
  "confidence": 0.987,
  "top_predictions": [
    {"class": "Melanoma...", "confidence": 0.987},
    {"class": "Benign", "confidence": 0.009},
    {"class": "Malignant", "confidence": 0.003}
  ],
  "processing_time": 0.234
}
```

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Project Structure

```
backend/
├── app.py              # Main FastAPI application
├── model_utils.py      # Model loading and preprocessing
├── requirements.txt    # Python dependencies
└── models/
    ├── best_model.keras    # Trained model (98.7% accuracy)
    └── classes.npy         # Class names
```

## Testing

### Using curl

```bash
curl -X POST "http://localhost:8000/predict" \
  -H "accept: application/json" \
  -H "Content-Type: multipart/form-data" \
  -F "file=@path/to/image.jpg"
```

### Using Python requests

```python
import requests

url = "http://localhost:8000/predict"
files = {"file": open("image.jpg", "rb")}
response = requests.post(url, files=files)
print(response.json())
```

## Notes

- Model achieves **98.7% accuracy** on 34 disease classes
- Preprocessing includes automatic contour extraction
- Average inference time: ~0.2-0.5 seconds
- Supports JPG and PNG images
