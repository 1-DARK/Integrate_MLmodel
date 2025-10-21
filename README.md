# Sentiment Analysis Integration Guide

## What It Does

**Sentiment Analysis Web Application** that analyzes text to determine emotional tone:

- **Input**: Text (manual typing or file upload)
- **Output**: Sentiment label (Positive/Negative/Neutral) + confidence score (-1 to +1)
- **Features**: 
  - File upload (.txt files)
  - Real-time analysis
  - Custom sentiment mapping for specific words
  - Modern web interface

**Example**: 
- Input: "I love this product!"
- Output: "Very Positive (0.95)"

## Quick Setup Commands

### 1. Install Dependencies

**Backend (Node.js + Python)**
```bash
cd backend
npm install
pip install fastapi uvicorn textblob
python -m textblob.download_corpora
```

**Frontend (React)**
```bash
cd frontend
npm install
```

### 2. Start Services

**Terminal 1 - ML Model (Python FastAPI)**
```bash
cd backend
python -m uvicorn ml_model:app --host 0.0.0.0 --port 8000
```

**Terminal 2 - Backend API (Node.js Express)**
```bash
cd backend
node server.js
```

**Terminal 3 - Frontend (React Vite)**
```bash
cd frontend
npm run dev
```

## Architecture Overview

```
Frontend (React) → Backend API (Express) → ML Model (FastAPI)
     :5174              :3001                :8000
```

## Key Integration Points

### 1. Frontend → Backend API
```javascript
// App.jsx
const response = await fetch("http://localhost:3001/api/predict", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ text }),
});
```

### 2. Backend API → ML Model
```javascript
// server.js
const response = await axios.post("http://localhost:8000/predict", req.body);
```

### 3. ML Model Response
```python
# ml_model.py
return {"sentiment": label, "score": sentiment}
```

## CORS Configuration

**Backend server.js**
```javascript
app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174"],
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));
```

## File Upload Integration

**Frontend File Handling**
```javascript
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = (e) => setText(e.target.result);
  reader.readAsText(file);
};
```

## Custom Sentiment Mapping

**ML Model Enhancement**
```python
custom_sentiments = {
    "fuck you": -0.99,
    "love you": 0.95,
    "amazing": 0.85
}
```

## Test Endpoints

```bash
# Test ML Model
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"text":"I love this!"}'

# Test Backend API
curl -X POST http://localhost:3001/api/predict \
  -H "Content-Type: application/json" \
  -d '{"text":"This is amazing!"}'
```

## Access URLs

- **Frontend**: http://localhost:5174
- **Backend API**: http://localhost:3001
- **ML Model**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Key Learning Points

1. **API Gateway Pattern**: Express server acts as gateway between frontend and ML model
2. **CORS Handling**: Configure cross-origin requests properly
3. **Error Propagation**: Handle errors at each layer
4. **File Processing**: Client-side file reading with FileReader API
5. **Custom ML Logic**: Override default sentiment with custom mappings
