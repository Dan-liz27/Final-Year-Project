# Skin Disease Classifier - Full Stack Web Application

🏥 AI-powered skin disease classification using the CE-EEN-B0 deep learning model.

## 🎯 Features

- **98.7% Accuracy** on 34 disease classes
- **Drag-and-drop** image upload
- **Real-time** predictions with confidence scores
- **Top-3** predictions display
- **Contour extraction** preprocessing
- **Responsive** modern UI

---

## 🏗️ Project Structure

```
Final Year Project/
├── backend/              # FastAPI Python server
│   ├── app.py           # Main API
│   ├── model_utils.py   # Model & preprocessing
│   ├── requirements.txt
│   └── models/
│       ├── best_model.keras  # Trained model (98.7% acc)
│       └── classes.npy      # 34 class names
│
└── frontend/            # React + Vite
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx
    │   │   ├── ImageUpload.jsx
    │   │   └── Prediction.jsx
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm or yarn

### 1. Backend Setup

```bash
cd backend

# Install Python dependencies
pip install -r requirements.txt

# Start the FastAPI server
python app.py
```

The backend will run on: **http://localhost:8000**

### 2. Frontend Setup

```bash
cd frontend

# Install Node dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on: **http://localhost:3000**

---

## 💻 Usage

1. Open your browser to **http://localhost:3000**
2. Upload a skin lesion image (JPG or PNG)
3. Click "Analyze Image"
4. View the prediction results with confidence scores

---

## 📊 Model Information

- **Architecture**: CE-EEN-B0 (Contour Extraction + EfficientNetB0)
- **Test Accuracy**: 98.70%
- **Classes**: 34 skin diseases
- **Training Dataset**: Massive Skin Disease Balanced Dataset (262,874 images)
- **Preprocessing**: Automated contour extraction and cropping

### Supported Diseases (34 Classes)

- Acne And Rosacea
- Melanoma Skin Cancer Nevi And Moles
- Bacterial Infections
- Fungal Infections
- Viral Infections
- Eczema
- Psoriasis
- And 27 more...

---

## 🛠️ Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **TensorFlow/Keras** - Deep learning
- **OpenCV** - Image preprocessing
- **Uvicorn** - ASGI server

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

---

## 📡 API Endpoints

### `GET /health`
Health check

### `GET /classes`
Get all disease classes

### `POST /predict`
Predict skin disease from image

**Request:**
- Content-Type: `multipart/form-data`
- Body: Image file

**Response:**
```json
{
  "prediction": "Melanoma Skin Cancer Nevi And Moles",
  "confidence": 0.987,
  "top_predictions": [...],
  "processing_time": 0.234
}
```

---

## 📝 Development

### Backend Development
```bash
cd backend
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
cd frontend
npm run dev
```

### Build for Production
```bash
cd frontend
npm run build
```

---

## ⚠️ Important Notes

- This is for **educational purposes** only
- Always consult a qualified dermatologist for medical diagnosis
- Maximum file size: 5MB
- Supported formats: JPG, PNG
- Average processing time: 0.2-0.5 seconds

---

## 🎓 Final Year Project

This project was developed as part of a final year project to demonstrate:
- Deep learning model training (98.7% accuracy)
- Full-stack web development
- RESTful API design
- Modern UI/UX principles

---

## 📄 License

For educational purposes only.

---

## 👤 Author

**Your Name**  
Final Year Project - 2025
