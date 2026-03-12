# 📚 Skin Disease Classifier - Complete Project Documentation

> **AI-Powered Skin Disease Classification System**  
> Full-stack web application for automated skin disease detection using deep learning

---

## 📋 Table of Contents

1. [Project Overview](#1-project-overview)
2. [Application Flow](#2-application-flow)
3. [System Architecture](#3-system-architecture)
4. [Technology Stack Explained](#4-technology-stack-explained)
5. [Project Structure & File Descriptions](#5-project-structure--file-descriptions)
6. [Backend Deep Dive](#6-backend-deep-dive)
7. [Frontend Deep Dive](#7-frontend-deep-dive)
8. [Database Schema](#8-database-schema)
9. [API Reference](#9-api-reference)
10. [Machine Learning Models](#10-machine-learning-models)
11. [Setup & Installation](#11-setup--installation)
12. [Development Workflow](#12-development-workflow)
13. [Troubleshooting](#13-troubleshooting)

---

## 1. Project Overview

### What is This Project?

The **Skin Disease Classifier** is a full-stack web application that leverages artificial intelligence to analyze skin lesion images and predict potential skin diseases with 98.7% accuracy. It combines:

- **Deep Learning**: CE-EEN-B0 model (EfficientNetB0 + Contour Extraction)
- **Modern Web Stack**: React + FastAPI
- **User Management**: Authentication, profiles, history tracking
- **Educational Content**: Disease information, prevention tips, photography guides

### Key Objectives

1. **Accurate Classification**: 98.7% accuracy on 34 skin disease classes
2. **User-Friendly Interface**: Intuitive drag-and-drop upload
3. **Comprehensive Tracking**: Complete analysis history with statistics
4. **Personalized Experience**: Recommendations based on user profile
5. **Educational Value**: Learn about skin health and disease prevention

### Target Audience

- Medical students and researchers
- Dermatology clinics (screening tool)
- General public (educational purposes)
- Healthcare professionals

> ⚠️ **Medical Disclaimer**: For educational and screening purposes only. Always consult a qualified dermatologist for medical diagnosis.

---

## 2. Application Flow

### 2.1 User Journey Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER JOURNEY FLOW                             │
└─────────────────────────────────────────────────────────────────┘

1. LANDING & AUTHENTICATION
   ↓
   User visits app → Welcome Page
   ↓
   New User? → Signup → Create Account → Auto Login
   Existing User? → Login → Enter Credentials → Authenticate
   ↓
   JWT Token Generated & Stored
   ↓

2. DASHBOARD (Home Page)
   ↓
   View Statistics (Total Analyses, Recent Results)
   View Quick Actions (Upload, View History, Profile)
   View Recommendations
   ↓

3. IMAGE ANALYSIS FLOW
   ↓
   Navigate to Upload Page
   ↓
   Drag & Drop Image OR Click to Browse
   ↓
   Image Validation (Format, Size, Quality)
   ↓
   Preview Image
   ↓
   Click "Analyze Image"
   ↓
   Frontend → API Request → Backend
   ↓
   Backend Processing:
   - Receive image
   - Preprocess (contour extraction)
   - Resize to 224x224
   - Normalize pixels
   - Run through ML model
   - Get top-3 predictions
   ↓
   Save to Database (predictions table)
   ↓
   Return Results to Frontend
   ↓
   Display Results:
   - Predicted disease
   - Confidence score
   - Top 3 predictions
   - Processing time
   ↓
   User can:
   - Add notes
   - Mark severity
   - Save to history
   - View recommendations
   ↓

4. HISTORY & PROFILE MANAGEMENT
   ↓
   View History → Filter/Sort → Export
   Update Profile → Demographics, Skin Type, Medical History
   View Statistics → Charts, Insights
   ↓

5. EDUCATIONAL CONTENT
   ↓
   Learn Hub → Articles, Photography Tips, Prevention, FAQ
```

### 2.2 Technical Data Flow

```
┌──────────────┐
│   Browser    │
│  (React UI)  │
└──────┬───────┘
       │ HTTP Request (axios)
       ↓
┌──────────────────────────────────────┐
│         Frontend (Port 3000)         │
│  ┌────────────────────────────────┐  │
│  │  React Components              │  │
│  │  - Pages (Welcome, Upload...)  │  │
│  │  - Context (Auth, App, Theme)  │  │
│  │  - Services (API calls)        │  │
│  └────────────────────────────────┘  │
└──────────────┬───────────────────────┘
               │ API Call (JWT Token in Header)
               ↓
┌──────────────────────────────────────┐
│         Backend (Port 8000)          │
│  ┌────────────────────────────────┐  │
│  │  FastAPI Application           │  │
│  │  - CORS Middleware             │  │
│  │  - JWT Authentication          │  │
│  │  - Route Handlers              │  │
│  └────────────┬───────────────────┘  │
│               ↓                       │
│  ┌────────────────────────────────┐  │
│  │  Business Logic (CRUD)         │  │
│  │  - User Management             │  │
│  │  - Prediction Storage          │  │
│  │  - Statistics Calculation      │  │
│  └────────────┬───────────────────┘  │
│               ↓                       │
│  ┌────────────────────────────────┐  │
│  │  Database (SQLite)             │  │
│  │  - users                       │  │
│  │  - user_profiles               │  │
│  │  - predictions                 │  │
│  └────────────────────────────────┘  │
│               ↓                       │
│  ┌────────────────────────────────┐  │
│  │  ML Model (TensorFlow)         │  │
│  │  - Load model.keras            │  │
│  │  - Preprocess image            │  │
│  │  - Make prediction             │  │
│  │  - Return top-3 results        │  │
│  └────────────────────────────────┘  │
└──────────────────────────────────────┘
```

### 2.3 Authentication Flow

```
SIGNUP FLOW:
1. User fills signup form (email, username, password)
2. Frontend validates input
3. POST /auth/register
4. Backend hashes password (bcrypt)
5. Create user in database
6. Auto-login: POST /auth/login
7. Generate JWT token
8. Store token in localStorage
9. Redirect to dashboard

LOGIN FLOW:
1. User enters credentials
2. POST /auth/login
3. Backend verifies password
4. Generate JWT token (expires in 30 min)
5. Return token to frontend
6. Store in localStorage
7. Set Authorization header for future requests
8. Redirect to dashboard

PROTECTED ROUTE ACCESS:
1. User navigates to protected page
2. Frontend checks for token
3. If no token → Redirect to login
4. If token exists → Include in Authorization header
5. Backend validates token
6. If valid → Process request
7. If invalid/expired → Return 401 → Redirect to login
```

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CLIENT TIER (Browser)                        │
│  React SPA with Context API for State Management                │
└─────────────────────┬───────────────────────────────────────────┘
                      │ HTTP/HTTPS
                      │ JSON Data
                      ↓
┌─────────────────────────────────────────────────────────────────┐
│                  APPLICATION TIER (Backend)                      │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  FastAPI Web Framework                                   │   │
│  │  - RESTful API Endpoints                                 │   │
│  │  - JWT Authentication Middleware                         │   │
│  │  - CORS Configuration                                    │   │
│  │  - Request/Response Validation (Pydantic)                │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Business Logic Layer                                    │   │
│  │  - CRUD Operations (crud.py)                             │   │
│  │  - Authentication Logic (auth.py)                        │   │
│  │  - Image Processing (model_utils.py)                     │   │
│  │  - Recommendation Engine (utils/recommendations.py)      │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────┬───────────────────────────────────────────┘
                      │
         ┌────────────┴────────────┐
         ↓                         ↓
┌─────────────────────┐   ┌─────────────────────┐
│   DATA TIER         │   │   ML TIER           │
│   (SQLite)          │   │   (TensorFlow)      │
│                     │   │                     │
│  - users            │   │  - Model Loading    │
│  - user_profiles    │   │  - Preprocessing    │
│  - predictions      │   │  - Inference        │
│                     │   │  - Post-processing  │
└─────────────────────┘   └─────────────────────┘
```

### 3.2 Detailed Architecture Components

#### **Frontend Architecture**

```
src/
├── main.jsx                    # Entry point, renders App
├── App.jsx                     # Root component, routing setup
│
├── context/                    # Global state management
│   ├── AuthContext.jsx        # User authentication state
│   ├── AppContext.jsx         # Application data (profile, history)
│   └── ThemeContext.jsx       # Dark/light theme state
│
├── pages/                      # Route components
│   ├── Welcome.jsx            # Landing page
│   ├── Login.jsx              # Login form
│   ├── Signup.jsx             # Registration form
│   ├── Home.jsx               # Dashboard
│   ├── UploadPage.jsx         # Image upload & analysis
│   ├── HistoryPage.jsx        # Analysis history
│   ├── Profile.jsx            # User profile management
│   └── Learn*/                # Educational pages
│
├── components/                 # Reusable UI components
│   ├── layout/                # Layout components
│   ├── ImageUpload.jsx        # Drag-drop upload
│   ├── PredictionCard.jsx     # Display results
│   └── ...
│
└── services/                   # API communication
    └── api.js                 # Axios instance, API methods
```

**Why This Structure?**
- **Separation of Concerns**: Pages handle routing, components handle UI, context handles state
- **Reusability**: Components can be used across multiple pages
- **Maintainability**: Easy to locate and update specific functionality
- **Scalability**: New features can be added without restructuring

#### **Backend Architecture**

```
backend/
├── app.py                      # FastAPI app, middleware, routes
│
├── routers/                    # Modular route handlers
│   ├── auth.py                # /auth/* - Login, register, token
│   ├── users.py               # /api/users/* - Profile, stats
│   └── predictions.py         # /api/predictions/* - CRUD
│
├── models.py                   # Pydantic models (validation)
├── schemas.py                  # SQLAlchemy models (database)
├── database.py                 # DB connection, session
├── crud.py                     # Database operations
├── auth.py                     # JWT, password hashing
│
├── model_utils.py              # ML model loading, prediction
│
├── utils/                      # Helper functions
│   ├── recommendations.py     # Recommendation engine
│   └── image_validator.py     # Image quality check
│
└── models/                     # ML model files
    ├── best_model.keras       # Trained model
    └── classes.npy            # Class labels
```

**Why This Structure?**
- **Modularity**: Each router handles specific domain (auth, users, predictions)
- **Separation**: Models (validation) vs Schemas (database) vs CRUD (operations)
- **Testability**: Each module can be tested independently
- **Clean Code**: Single responsibility principle

---

## 4. Technology Stack Explained

### 4.1 Backend Technologies

| Technology | Version | Purpose | Why We Use It |
|------------|---------|---------|---------------|
| **Python** | 3.10+ | Core language | Excellent for ML/AI, rich ecosystem, readable syntax |
| **FastAPI** | Latest | Web framework | Modern, fast, automatic API docs, async support, type hints |
| **Uvicorn** | Latest | ASGI server | High performance, async support, production-ready |
| **SQLAlchemy** | 2.x | ORM | Database abstraction, prevents SQL injection, easy migrations |
| **SQLite** | 3.x | Database | Lightweight, serverless, perfect for development, easy deployment |
| **Pydantic** | Latest | Data validation | Automatic validation, type safety, clear error messages |
| **TensorFlow** | 2.x | ML framework | Industry standard, extensive model support, GPU acceleration |
| **Keras** | 3.x | Model API | High-level API for TensorFlow, easy model building |
| **OpenCV** | 4.x | Image processing | Contour extraction, image manipulation, computer vision |
| **Pillow** | Latest | Image handling | Image I/O, format conversion, basic operations |
| **PyJWT** | Latest | JWT tokens | Secure authentication, stateless sessions |
| **Passlib** | Latest | Password hashing | Bcrypt hashing, secure password storage |
| **Python-multipart** | Latest | File uploads | Handle multipart form data for image uploads |

**Key Design Decisions:**

1. **FastAPI over Flask/Django**:
   - Automatic API documentation (Swagger UI)
   - Built-in data validation with Pydantic
   - Async support for better performance
   - Type hints for better IDE support

2. **SQLite over PostgreSQL/MySQL**:
   - No separate database server needed
   - Easy backup (single file)
   - Perfect for development and small-scale deployment
   - Can migrate to PostgreSQL later if needed

3. **JWT over Session-based Auth**:
   - Stateless (no server-side session storage)
   - Scalable (works across multiple servers)
   - Mobile-friendly (easy to implement in apps)

### 4.2 Frontend Technologies

| Technology | Version | Purpose | Why We Use It |
|------------|---------|---------|---------------|
| **React** | 18.x | UI library | Component-based, virtual DOM, large ecosystem, hooks |
| **Vite** | 5.x | Build tool | Fast HMR, optimized builds, modern dev experience |
| **React Router** | 6.x | Routing | SPA navigation, nested routes, protected routes |
| **Axios** | Latest | HTTP client | Promise-based, interceptors, automatic JSON parsing |
| **Framer Motion** | Latest | Animations | Declarative animations, smooth transitions, gestures |
| **React Hot Toast** | Latest | Notifications | Beautiful toasts, customizable, promise-based |
| **Lucide React** | Latest | Icons | Modern icons, tree-shakeable, consistent design |
| **Tailwind CSS** | 3.x | Styling | Utility-first, responsive, customizable, fast development |

**Key Design Decisions:**

1. **React over Vue/Angular**:
   - Largest community and ecosystem
   - Flexible (library, not framework)
   - Excellent for complex UIs
   - Strong job market demand

2. **Vite over Create React App**:
   - 10-100x faster dev server
   - Instant HMR (Hot Module Replacement)
   - Optimized production builds
   - Modern tooling (ESBuild)

3. **Context API over Redux**:
   - Built into React (no extra dependency)
   - Simpler for small-medium apps
   - Less boilerplate code
   - Easier to learn

4. **Tailwind over CSS-in-JS**:
   - Faster development
   - Smaller bundle size
   - Consistent design system
   - No runtime overhead

---

## 5. Project Structure & File Descriptions

### 5.1 Root Directory

```
Final Year Project/
├── backend/                    # Backend API server
├── frontend/                   # React frontend application
├── data/                       # Training datasets
├── *.ipynb                     # Jupyter notebooks for ML training
├── README.md                   # Project overview
└── PROJECT_DOCUMENTATION.md    # This file
```

### 5.2 Backend Structure (Detailed)

```
backend/
├── app.py                      # Main FastAPI application
│   Purpose: Entry point, middleware setup, route registration
│   Key Functions:
│   - Initialize FastAPI app
│   - Configure CORS
│   - Mount static files (/uploads)
│   - Include routers
│   - Define core endpoints (/predict, /health)
│   - Startup event (load model, init DB)
│
├── auth.py                     # Authentication utilities
│   Purpose: JWT token handling, password hashing
│   Key Functions:
│   - verify_password(): Check password against hash
│   - get_password_hash(): Hash password with bcrypt
│   - create_access_token(): Generate JWT token
│   - get_current_user(): Dependency for protected routes
│
├── crud.py                     # Database CRUD operations
│   Purpose: All database interactions
│   Key Functions:
│   - create_user(): Register new user
│   - get_user_by_email(): Find user for login
│   - get_user_profile(): Fetch user profile
│   - update_user_profile(): Update profile data
│   - create_prediction(): Save analysis result
│   - get_user_predictions(): Fetch history
│   - get_user_stats(): Calculate statistics
│   - get_recommendations(): Generate personalized tips
│
├── database.py                 # Database configuration
│   Purpose: SQLAlchemy setup, session management
│   Key Functions:
│   - init_db(): Create tables
│   - get_db(): Dependency for DB session
│
├── models.py                   # Pydantic models
│   Purpose: Request/response validation
│   Models:
│   - UserCreate: Signup data
│   - UserResponse: User info
│   - ProfileBase: Profile data
│   - PredictionCreate: New prediction
│   - PredictionResponse: Prediction with details
│
├── schemas.py                  # SQLAlchemy models
│   Purpose: Database table definitions
│   Tables:
│   - User: Authentication data
│   - UserProfile: Extended user info
│   - Prediction: Analysis results
│
├── model_utils.py              # ML model utilities
│   Purpose: Model loading, image preprocessing, prediction
│   Key Functions:
│   - load_model(): Load Keras model and classes
│   - preprocess_image(): Contour extraction, resize
│   - predict(): Run inference, return top-3
│
├── routers/
│   ├── auth.py                # Authentication endpoints
│   │   Routes:
│   │   - POST /auth/register: Create account
│   │   - POST /auth/login: Get JWT token
│   │   - GET /auth/me: Get current user
│   │   - POST /auth/refresh: Refresh token
│   │
│   ├── users.py               # User management endpoints
│   │   Routes:
│   │   - GET /api/users/profile: Get profile
│   │   - PUT /api/users/profile: Update profile
│   │   - GET /api/users/stats: Get statistics
│   │   - GET /api/users/recommendations: Get tips
│   │
│   ├── predictions.py         # Prediction endpoints
│   │   Routes:
│   │   - POST /api/predictions/: Create prediction
│   │   - GET /api/predictions/: List predictions
│   │   - GET /api/predictions/{id}: Get one
│   │   - PUT /api/predictions/{id}: Update notes
│   │   - DELETE /api/predictions/{id}: Delete
│   │   - POST /api/predictions/upload-image: Upload
│   │
│   ├── articles.py            # Educational content
│   ├── photography.py         # Photography tips
│   ├── prevention.py          # Prevention guides
│   ├── doctors.py             # Doctor consultation info
│   └── faq.py                 # FAQ endpoints
│
├── utils/
│   ├── recommendations.py     # Recommendation engine
│   │   Purpose: Generate personalized skin care tips
│   │   Logic: Based on skin type, history, conditions
│   │
│   └── image_validator.py     # Image quality checker
│       Purpose: Validate image before prediction
│       Checks: Resolution, sharpness, brightness, contrast
│
├── models/
│   ├── best_model.keras       # Trained CE-EEN-B0 model (92 MB)
│   └── classes.npy            # 34 disease class names
│
├── uploads/                    # User-uploaded images
├── database/
│   └── skin_classifier.db     # SQLite database file
│
├── requirements.txt            # Python dependencies
├── .env                        # Environment variables
└── README.md                   # Backend documentation
```

### 5.3 Frontend Structure (Detailed)

```
frontend/
├── public/                     # Static assets
│   ├── vite.svg               # Vite logo
│   └── ...                    # Favicons, manifest
│
├── src/
│   ├── main.jsx               # Application entry point
│   │   Purpose: Render root component
│   │   - Import React and ReactDOM
│   │   - Render <App /> into #root
│   │   - Import global CSS
│   │
│   ├── App.jsx                # Root component
│   │   Purpose: Setup routing and providers
│   │   Structure:
│   │   - BrowserRouter (routing)
│   │   - ThemeProvider (dark/light mode)
│   │   - AuthProvider (authentication)
│   │   - AppProvider (app state)
│   │   - Routes (page routing)
│   │   - Layout (header/footer)
│   │
│   ├── index.css              # Global styles
│   │   Purpose: Tailwind imports, custom CSS
│   │   - Tailwind directives
│   │   - Custom animations
│   │   - Global resets
│   │
│   ├── context/
│   │   ├── AuthContext.jsx   # Authentication state
│   │   │   State:
│   │   │   - user: Current user object
│   │   │   - loading: Auth check in progress
│   │   │   Methods:
│   │   │   - signup(email, username, password)
│   │   │   - login(email, password)
│   │   │   - logout()
│   │   │   - loadUser() (on mount)
│   │   │
│   │   ├── AppContext.jsx    # Application state
│   │   │   State:
│   │   │   - user: Profile data
│   │   │   - stats: User statistics
│   │   │   - history: Prediction history
│   │   │   Methods:
│   │   │   - updateUser(data)
│   │   │   - clearHistory()
│   │   │   - getRecommendations()
│   │   │
│   │   └── ThemeContext.jsx  # Theme state
│   │       State:
│   │       - theme: 'light' | 'dark'
│   │       Methods:
│   │       - toggleTheme()
│   │
│   ├── pages/
│   │   ├── Welcome.jsx       # Landing page
│   │   │   Purpose: First page users see
│   │   │   Features:
│   │   │   - Hero section with CTA
│   │   │   - Feature highlights
│   │   │   - How it works
│   │   │   - Call to action (Sign up)
│   │   │
│   │   ├── Login.jsx         # Login page
│   │   │   Purpose: User authentication
│   │   │   Features:
│   │   │   - Email/password form
│   │   │   - Form validation
│   │   │   - Error handling
│   │   │   - Redirect to dashboard on success
│   │   │
│   │   ├── Signup.jsx        # Registration page
│   │   │   Purpose: New user registration
│   │   │   Features:
│   │   │   - Email, username, password fields
│   │   │   - Password strength indicator
│   │   │   - Validation (email format, password length)
│   │   │   - Auto-login after signup
│   │   │
│   │   ├── Home.jsx          # Dashboard
│   │   │   Purpose: Main landing after login
│   │   │   Features:
│   │   │   - Statistics cards (total analyses, accuracy)
│   │   │   - Recent predictions
│   │   │   - Quick actions (Upload, History, Profile)
│   │   │   - Recommendations
│   │   │
│   │   ├── UploadPage.jsx    # Image upload & analysis
│   │   │   Purpose: Core feature - analyze images
│   │   │   Features:
│   │   │   - Drag-and-drop upload
│   │   │   - Image preview
│   │   │   - Quality validation
│   │   │   - Analyze button
│   │   │   - Results display (prediction, confidence, top-3)
│   │   │   - Save to history
│   │   │
│   │   ├── HistoryPage.jsx   # Analysis history
│   │   │   Purpose: View past analyses
│   │   │   Features:
│   │   │   - List all predictions
│   │   │   - Filter by date, disease, confidence
│   │   │   - Sort options
│   │   │   - Delete predictions
│   │   │   - Export data
│   │   │   - Statistics overview
│   │   │
│   │   ├── Profile.jsx       # User profile
│   │   │   Purpose: Manage user information
│   │   │   Sections:
│   │   │   - Personal Info (name, age, gender)
│   │   │   - Skin Profile (type, tone, concerns)
│   │   │   - Medical History (allergies, medications)
│   │   │   - Lifestyle (sun exposure, skincare)
│   │   │   - Settings (confidence threshold, view mode)
│   │   │   - Danger Zone (clear history, logout)
│   │   │
│   │   ├── LearnHub.jsx      # Educational hub
│   │   │   Purpose: Central learning page
│   │   │   Links to:
│   │   │   - Disease articles
│   │   │   - Photography tips
│   │   │   - Prevention guides
│   │   │   - Doctor consultation
│   │   │   - FAQ
│   │   │
│   │   ├── ArticlesPage.jsx  # Disease information
│   │   │   Purpose: Learn about skin diseases
│   │   │   Features:
│   │   │   - List of 34 diseases
│   │   │   - Descriptions, symptoms, causes
│   │   │   - Treatment options
│   │   │   - When to see a doctor
│   │   │
│   │   ├── PhotographyPage.jsx # Photo tips
│   │   │   Purpose: How to take good skin photos
│   │   │   Tips:
│   │   │   - Lighting (natural, indirect)
│   │   │   - Distance (close-up, clear)
│   │   │   - Focus (sharp, not blurry)
│   │   │   - Background (plain, contrasting)
│   │   │
│   │   ├── PreventionPage.jsx # Prevention guides
│   │   │   Purpose: Skin health tips
│   │   │   Topics:
│   │   │   - Sun protection
│   │   │   - Skincare routine
│   │   │   - Diet and hydration
│   │   │   - Regular check-ups
│   │   │
│   │   ├── DoctorGuidePage.jsx # Consultation info
│   │   │   Purpose: When and how to see a doctor
│   │   │   Content:
│   │   │   - Warning signs
│   │   │   - What to expect
│   │   │   - Questions to ask
│   │   │   - Preparing for appointment
│   │   │
│   │   └── FAQPage.jsx       # Frequently asked questions
│   │       Purpose: Answer common questions
│   │       Topics:
│   │       - How accurate is the AI?
│   │       - Is my data secure?
│   │       - Can I use this for diagnosis?
│   │       - What image formats are supported?
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Layout.jsx    # Page wrapper
│   │   │   │   Purpose: Consistent layout across pages
│   │   │   │   Structure: Header + Main Content + Footer
│   │   │   │
│   │   │   ├── Header.jsx    # Navigation bar
│   │   │   │   Features:
│   │   │   │   - Logo and app name
│   │   │   │   - Navigation links (Home, Upload, History, Learn, Profile)
│   │   │   │   - Theme toggle (dark/light)
│   │   │   │   - User menu (logout)
│   │   │   │
│   │   │   └── Footer.jsx    # Page footer
│   │   │       Content:
│   │   │       - Copyright
│   │   │       - Links (About, Privacy, Terms)
│   │   │       - Social media
│   │   │
│   │   ├── ProtectedRoute.jsx # Route guard
│   │   │   Purpose: Protect authenticated routes
│   │   │   Logic: If not logged in → redirect to login
│   │   │
│   │   ├── ImageUpload.jsx   # Drag-drop component
│   │   │   Purpose: Handle image uploads
│   │   │   Features:
│   │   │   - Drag and drop zone
│   │   │   - Click to browse
│   │   │   - File validation
│   │   │   - Preview
│   │   │
│   │   ├── PredictionCard.jsx # Result display
│   │   │   Purpose: Show prediction results
│   │   │   Data:
│   │   │   - Disease name
│   │   │   - Confidence percentage
│   │   │   - Top 3 predictions
│   │   │   - Processing time
│   │   │
│   │   ├── StatsCard.jsx     # Statistics display
│   │   │   Purpose: Show user stats
│   │   │   Metrics:
│   │   │   - Total analyses
│   │   │   - Average confidence
│   │   │   - Most common condition
│   │   │
│   │   └── RecommendationsCard.jsx # Tips display
│   │       Purpose: Show personalized recommendations
│   │       Based on: Skin type, history, conditions
│   │
│   ├── services/
│   │   └── api.js            # API service layer
│   │       Purpose: Centralize all API calls
│   │       Structure:
│   │       - Axios instance with base URL
│   │       - Request interceptor (add JWT token)
│   │       - Response interceptor (handle errors)
│   │       - API methods grouped by domain:
│   │         * authAPI: register, login, getCurrentUser
│   │         * userAPI: getProfile, updateProfile, getStats
│   │         * predictionsAPI: create, getAll, getById, update, delete
│   │         * mlAPI: predict, validateImage
│   │
│   ├── data/
│   │   ├── articles.js       # Static disease articles
│   │   └── faq.js            # Static FAQ data
│   │
│   └── utils/                # Utility functions (if needed)
│
├── package.json              # Node dependencies
├── vite.config.js            # Vite configuration
│   - Server port: 3000
│   - Proxy API requests to backend
│   - Build optimizations
│
├── tailwind.config.js        # Tailwind configuration
│   - Custom colors
│   - Dark mode settings
│   - Custom animations
│
└── postcss.config.js         # PostCSS configuration
    - Tailwind CSS processing
    - Autoprefixer
```

---

## 6. Backend Deep Dive

### 6.1 Request/Response Flow

```
1. CLIENT REQUEST
   ↓
   HTTP Request (e.g., POST /api/predictions/)
   Headers: Authorization: Bearer <JWT>
   Body: { image_path, predicted_class, confidence, ... }
   ↓

2. FASTAPI RECEIVES REQUEST
   ↓
   app.py → Route handler found
   ↓

3. MIDDLEWARE PROCESSING
   ↓
   CORS Middleware → Check origin, add headers
   ↓

4. AUTHENTICATION (if protected route)
   ↓
   Extract JWT from Authorization header
   ↓
   auth.get_current_user() → Verify token
   ↓
   If valid → Extract user_id
   If invalid → Return 401 Unauthorized
   ↓

5. REQUEST VALIDATION
   ↓
   Pydantic model validates request body
   ↓
   If invalid → Return 422 Validation Error
   If valid → Continue
   ↓

6. BUSINESS LOGIC
   ↓
   Route handler calls CRUD function
   ↓
   crud.create_prediction(db, user_id, data)
   ↓
   Database operation (INSERT, SELECT, UPDATE, DELETE)
   ↓

7. RESPONSE PREPARATION
   ↓
   Format data according to response model
   ↓
   Pydantic model serializes response
   ↓

8. SEND RESPONSE
   ↓
   HTTP Response (e.g., 201 Created)
   Body: { id, user_id, predicted_class, ... }
   ↓

9. CLIENT RECEIVES RESPONSE
   ↓
   Frontend processes data
   ↓
   Update UI
```

### 6.2 Database Operations (CRUD)

**Example: Creating a Prediction**

```python
# 1. User uploads image and gets prediction
# 2. Frontend calls: POST /api/predictions/

# 3. Route handler (predictions.py)
@router.post("/")
async def create_prediction(
    prediction: PredictionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # 4. Call CRUD function
    db_prediction = crud.create_prediction(
        db=db,
        user_id=current_user.id,
        prediction_data=prediction
    )
    return db_prediction

# 5. CRUD function (crud.py)
def create_prediction(db, user_id, prediction_data):
    # Create database object
    db_prediction = Prediction(
        user_id=user_id,
        image_path=prediction_data.image_path,
        predicted_class=prediction_data.predicted_class,
        confidence=prediction_data.confidence,
        top_predictions=prediction_data.top_predictions,
        processing_time=prediction_data.processing_time
    )
    
    # Add to session
    db.add(db_prediction)
    
    # Commit to database
    db.commit()
    
    # Refresh to get generated ID
    db.refresh(db_prediction)
    
    return db_prediction
```

### 6.3 ML Model Pipeline

```
IMAGE UPLOAD
↓
1. RECEIVE IMAGE
   - File uploaded via multipart/form-data
   - Read bytes from UploadFile
   ↓

2. VALIDATE IMAGE
   - Check file type (JPG, PNG)
   - Check file size (< 5MB)
   - Open with PIL
   ↓

3. PREPROCESS IMAGE
   model_utils.preprocess_image(img_array)
   ↓
   a. Convert to grayscale
   b. Find contours (OpenCV)
   c. Extract largest contour (lesion)
   d. Crop to bounding box
   e. Resize to 224x224
   f. Normalize pixels (0-1)
   g. Expand dimensions for batch
   ↓

4. LOAD MODEL
   - Load best_model.keras (cached)
   - Load classes.npy (34 disease names)
   ↓

5. PREDICT
   predictions = model.predict(preprocessed_image)
   ↓
   Returns: Array of 34 probabilities
   ↓

6. POST-PROCESS
   - Get top 3 predictions
   - Format as:
     [
       { class: "Melanoma", confidence: 0.987 },
       { class: "Benign", confidence: 0.009 },
       { class: "Malignant", confidence: 0.003 }
     ]
   ↓

7. RETURN RESULTS
   {
     prediction: "Melanoma Skin Cancer Nevi And Moles",
     confidence: 0.987,
     top_predictions: [...],
     processing_time: 0.234
   }
```

---

## 7. Frontend Deep Dive

### 7.1 Component Lifecycle & State Management

**Example: Upload Page Flow**

```
USER NAVIGATES TO /upload
↓
1. ROUTE MATCHING
   React Router matches route
   ↓
   Renders <UploadPage />
   ↓

2. COMPONENT MOUNT
   UploadPage.jsx
   ↓
   useState hooks initialize:
   - selectedImage: null
   - preview: null
   - prediction: null
   - loading: false
   ↓
   useContext hooks access:
   - AuthContext (user)
   - AppContext (updateHistory)
   ↓

3. USER INTERACTION
   User drags image onto drop zone
   ↓
   onDrop event handler
   ↓
   Validate file (type, size)
   ↓
   setSelectedImage(file)
   setPreview(URL.createObjectURL(file))
   ↓
   UI updates (preview shown)
   ↓

4. USER CLICKS "ANALYZE"
   onClick handler
   ↓
   setLoading(true)
   ↓
   Call API:
   const result = await mlAPI.predict(selectedImage)
   ↓
   API request sent to backend
   ↓
   Backend processes (see ML pipeline above)
   ↓
   Response received
   ↓
   setPrediction(result)
   setLoading(false)
   ↓
   UI updates (results shown)
   ↓

5. SAVE TO HISTORY
   User clicks "Save"
   ↓
   Call API:
   await predictionsAPI.create({
     image_path: uploadedPath,
     predicted_class: result.prediction,
     confidence: result.confidence,
     top_predictions: result.top_predictions
   })
   ↓
   Update AppContext:
   updateHistory()
   ↓
   Show success toast
```

### 7.2 Context API Flow

**AuthContext Example:**

```javascript
// 1. PROVIDER SETUP (App.jsx)
<AuthProvider>
  <Routes>...</Routes>
</AuthProvider>

// 2. CONTEXT CREATION (AuthContext.jsx)
const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  
  // Load user on mount
  useEffect(() => {
    loadUser()
  }, [])
  
  const loadUser = async () => {
    const token = localStorage.getItem('access_token')
    if (token) {
      const userData = await authAPI.getCurrentUser()
      setUser(userData)
    }
    setLoading(false)
  }
  
  const login = async (email, password) => {
    const data = await authAPI.login(email, password)
    setUser(data.user)
  }
  
  const logout = () => {
    localStorage.removeItem('access_token')
    setUser(null)
  }
  
  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// 3. CONSUMING CONTEXT (any component)
import { useAuth } from '../context/AuthContext'

function Profile() {
  const { user, logout } = useAuth()
  
  return (
    <div>
      <h1>Welcome, {user.username}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

**Why Context API?**
- Avoids prop drilling (passing props through many levels)
- Centralized state management
- Easy to access from any component
- No external dependencies (built into React)

---

## 8. Database Schema

### 8.1 Entity Relationship Diagram

```
┌─────────────────────┐
│       users         │
├─────────────────────┤
│ id (PK)             │
│ email (UNIQUE)      │
│ username (UNIQUE)   │
│ hashed_password     │
│ is_active           │
│ created_at          │
└──────────┬──────────┘
           │
           │ 1:1
           │
           ↓
┌─────────────────────┐
│   user_profiles     │
├─────────────────────┤
│ id (PK)             │
│ user_id (FK, UNIQUE)│
│ age                 │
│ gender              │
│ location            │
│ skin_type           │
│ skin_tone           │
│ skin_concerns       │
│ has_allergies       │
│ allergy_details     │
│ on_medication       │
│ medication_details  │
│ previous_conditions │
│ family_history      │
│ sun_exposure        │
│ skincare_level      │
│ confidence_threshold│
│ view_mode           │
│ updated_at          │
└─────────────────────┘
           ↑
           │ 1:many
           │
┌──────────┴──────────┐
│    predictions      │
├─────────────────────┤
│ id (PK)             │
│ user_id (FK)        │
│ image_path          │
│ image_size          │
│ image_format        │
│ predicted_class     │
│ confidence          │
│ top_predictions     │
│ processing_time     │
│ model_version       │
│ notes               │
│ severity            │
│ created_at          │
│ updated_at          │
└─────────────────────┘
```

### 8.2 Table Descriptions

**users** - Authentication data
- Stores login credentials
- One user can have one profile
- One user can have many predictions

**user_profiles** - Extended user information
- Demographics (age, gender, location)
- Skin profile (type, tone, concerns)
- Medical history (allergies, medications)
- Lifestyle (sun exposure, skincare routine)
- Settings (confidence threshold, view mode)

**predictions** - Analysis results
- Links to user who created it
- Stores image metadata
- Stores prediction results (class, confidence, top-3)
- Stores processing metadata (time, model version)
- User can add notes and severity

---

## 9. API Reference

### 9.1 Authentication Endpoints

#### POST /auth/register
**Purpose**: Create new user account

**Request:**
```json
{
  "email": "user@example.com",
  "username": "johndoe",
  "password": "securepassword123"
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "is_active": true,
  "created_at": "2026-01-31T08:00:00"
}
```

**Errors:**
- 400: Email/username already exists
- 422: Validation error (invalid email, weak password)

---

#### POST /auth/login
**Purpose**: Authenticate user and get JWT token

**Request (form-urlencoded):**
```
username=user@example.com
password=securepassword123
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**Errors:**
- 401: Invalid credentials
- 422: Missing fields

**Usage:**
Store `access_token` in localStorage. Include in subsequent requests:
```
Authorization: Bearer <access_token>
```

---

#### GET /auth/me
**Purpose**: Get current authenticated user

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "username": "johndoe",
  "is_active": true
}
```

**Errors:**
- 401: Invalid/expired token

---

### 9.2 User Endpoints

#### GET /api/users/profile
**Purpose**: Get user profile with all details

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user_id": 1,
  "age": 25,
  "gender": "male",
  "location": "New York",
  "skin_type": "oily",
  "skin_tone": "medium",
  "skin_concerns": ["acne", "dark spots"],
  "has_allergies": false,
  "on_medication": false,
  "sun_exposure": "moderate",
  "skincare_level": "intermediate",
  "confidence_threshold": 70,
  "view_mode": "grid"
}
```

---

#### PUT /api/users/profile
**Purpose**: Update user profile

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "age": 26,
  "skin_type": "combination",
  "skin_concerns": ["acne", "wrinkles"]
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "user_id": 1,
  "age": 26,
  "skin_type": "combination",
  ...
}
```

---

#### GET /api/users/stats
**Purpose**: Get user statistics

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200 OK):**
```json
{
  "total_analyses": 15,
  "most_common_condition": "Acne And Rosacea",
  "average_confidence": 0.87,
  "last_analysis_date": "2026-01-31",
  "conditions_breakdown": {
    "Acne And Rosacea": 5,
    "Eczema": 3,
    "Melanoma": 2
  }
}
```

---

### 9.3 Prediction Endpoints

#### POST /predict
**Purpose**: Analyze image and get disease prediction

**Request (multipart/form-data):**
```
file: <image-file>
```

**Response (200 OK):**
```json
{
  "prediction": "Melanoma Skin Cancer Nevi And Moles",
  "confidence": 0.987,
  "top_predictions": [
    {
      "class": "Melanoma Skin Cancer Nevi And Moles",
      "confidence": 0.987
    },
    {
      "class": "Benign Keratosis-like Lesions",
      "confidence": 0.009
    },
    {
      "class": "Malignant Lesions",
      "confidence": 0.003
    }
  ],
  "processing_time": 0.234
}
```

**Errors:**
- 400: Invalid file type
- 413: File too large
- 500: Prediction failed

---

#### POST /api/predictions/
**Purpose**: Save prediction to history

**Headers:**
```
Authorization: Bearer <token>
```

**Request:**
```json
{
  "image_path": "/uploads/image123.jpg",
  "predicted_class": "Melanoma",
  "confidence": 0.95,
  "top_predictions": [...],
  "processing_time": 0.234
}
```

**Response (201 Created):**
```json
{
  "id": 1,
  "user_id": 1,
  "image_path": "/uploads/image123.jpg",
  "predicted_class": "Melanoma",
  "confidence": 0.95,
  "created_at": "2026-01-31T08:00:00",
  ...
}
```

---

#### GET /api/predictions/
**Purpose**: Get all user predictions

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `skip`: Offset (default: 0)
- `limit`: Max results (default: 100)
- `sort_by`: Field to sort by (default: created_at)
- `order`: asc or desc (default: desc)

**Example:**
```
GET /api/predictions/?skip=0&limit=10&sort_by=confidence&order=desc
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "predicted_class": "Melanoma",
    "confidence": 0.95,
    "created_at": "2026-01-31T08:00:00",
    ...
  },
  ...
]
```

---

## 10. Machine Learning Models

### 10.1 Current Model: CE-EEN-B0

**Architecture:**
```
Input Image (any size)
↓
Preprocessing:
  1. Grayscale conversion
  2. Contour detection (OpenCV)
  3. Extract largest contour (lesion)
  4. Crop to bounding box
  5. Resize to 224x224
  6. Normalize (0-1)
↓
EfficientNetB0 (pre-trained on ImageNet)
  - Compound scaling
  - Mobile-optimized
  - Depth: 224 layers
  - Parameters: 5.3M
↓
Global Average Pooling
↓
Dense Layer (256 units, ReLU)
↓
Dropout (0.5)
↓
Output Layer (34 units, Softmax)
↓
Predictions (34 probabilities)
```

**Training Details:**
- **Dataset**: Massive Skin Disease Balanced Dataset
- **Images**: 262,874 (balanced across 34 classes)
- **Augmentation**: Rotation, flip, zoom, brightness
- **Optimizer**: Adam (lr=0.0001)
- **Loss**: Categorical Crossentropy
- **Metrics**: Accuracy, Precision, Recall
- **Epochs**: 50 (early stopping)
- **Batch Size**: 32
- **Validation Split**: 20%

**Performance:**
- **Test Accuracy**: 98.70%
- **Precision**: 98.5%
- **Recall**: 98.3%
- **F1-Score**: 98.4%
- **Inference Time**: 0.2-0.5 seconds

**Supported Diseases (34 Classes):**
1. Acne And Rosacea
2. Actinic Keratosis Basal Cell Carcinoma
3. Atopic Dermatitis
4. Bullous Disease
5. Cellulitis Impetigo
6. Eczema
7. Exanthems And Drug Eruptions
8. Hair Loss Alopecia
9. Herpes HPV
10. Light Diseases And Disorders Of Pigmentation
11. Lupus
12. Melanoma Skin Cancer Nevi And Moles
13. Nail Fungus
14. Poison Ivy
15. Psoriasis Lichen Planus
16. Scabies Lyme Disease
17. Seborrheic Keratoses
18. Systemic Disease
19. Tinea Ringworm Candidiasis
20. Urticaria Hives
21. Vascular Tumors
22. Vasculitis
23. Warts Molluscum
24. ... (and 11 more)

---

## 11. Setup & Installation

### Prerequisites
- Python 3.10+
- Node.js 18+
- npm 9+
- Git

### Backend Setup

```bash
cd backend
pip install -r requirements.txt

# Create .env file
echo "DATABASE_URL=sqlite:///./skin_classifier.db" > .env
echo "SECRET_KEY=your-secret-key-here" >> .env
echo "ALGORITHM=HS256" >> .env
echo "ACCESS_TOKEN_EXPIRE_MINUTES=30" >> .env

# Start server
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

**URLs:**
- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- API Docs: http://localhost:8000/docs

---

## 12. Development Workflow

### Running in Development

**Backend:**
```bash
cd backend
uvicorn app:app --reload
```

**Frontend:**
```bash
cd frontend
npm run dev
```

### Building for Production

```bash
cd frontend
npm run build
# Output: frontend/dist/
```

---

## 13. Troubleshooting

**Backend won't start:**
- Check Python version: `python --version`
- Verify model files in `models/`
- Check `.env` configuration

**Frontend won't start:**
- Check Node version: `node --version`
- Clear cache: `rm -rf node_modules && npm install`
- Check port 3000 availability

**CORS errors:**
- Verify `ALLOWED_ORIGINS` in backend `.env`
- Check frontend API URL

**Model loading errors:**
- Verify `best_model.keras` exists
- Check TensorFlow version
- Ensure sufficient RAM (~500MB)

---

**Last Updated**: January 31, 2026  
**Version**: 2.0.0  
**Author**: Final Year Project Team
