# Skin Disease Classifier - Frontend

React + Vite frontend for skin disease classification.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit: **http://localhost:3000**

## 📦 Dependencies

- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS
- **Axios** - HTTP client

## 🎨 Components

### `Header.jsx`
App header with title and description

### `ImageUpload.jsx`
- Drag-and-drop file upload
- File validation (type, size)
- Image preview
- Loading states

### `Prediction.jsx`
- Displays prediction results
- Confidence score visualization
- Top-3 predictions list
- Processing time display
- Medical disclaimer

### `App.jsx`
Main component that:
- Manages app state
- Handles API calls
- Coordinates components
- Error handling

## 🔧 Configuration

### API URL
Edit in `src/App.jsx`:
```javascript
const API_URL = 'http://localhost:8000';
```

### Proxy (optional)
Configured in `vite.config.js` to proxy `/api` to backend.

## 🏗️ Build for Production

```bash
npm run build
```

Output will be in `dist/` folder.

## 📱 Features

- ✅ Responsive design
- ✅ Modern gradient UI
- ✅ Loading animations
- ✅ Error handling
- ✅ File validation
- ✅ Confidence visualization
- ✅ Medical disclaimers

## 🎨 Tailwind Configuration

Custom primary colors defined in `tailwind.config.js`:
- `primary-50` to `primary-700`

## 🔗 API Integration

Uses Axios to make POST requests to `/predict` endpoint:

```javascript
const formData = new FormData();
formData.append('file', imageFile);

const response = await axios.post(`${API_URL}/predict`, formData);
```
