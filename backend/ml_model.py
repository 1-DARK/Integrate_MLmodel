from fastapi import FastAPI  # pyright: ignore[reportMissingImports]
from pydantic import BaseModel  # pyright: ignore[reportMissingImports]
from textblob import TextBlob  # pyright: ignore[reportMissingImports]

app = FastAPI()

class TextData(BaseModel):
    text: str

@app.post("/predict")
async def predict(data: TextData):
    # Check for specific words/phrases with custom sentiment scores
    text_lower = data.text.lower().strip()
    
    # Custom sentiment mapping for specific words
    custom_sentiments = {
        "hate you": -0.90,
        "i hate": -0.85,
        "terrible": -0.80,
        "awful": -0.75,
        "love you": 0.95,
        "i love": 0.90,
        "amazing": 0.85,
        "wonderful": 0.80,
        "excellent": 0.75
    }
    
    # Check if text matches any custom sentiment
    for phrase, score in custom_sentiments.items():
        if phrase in text_lower:
            label = "Very Negative" if score < -0.5 else "Very Positive" if score > 0.5 else "Negative" if score < 0 else "Positive"
            return {"sentiment": label, "score": score}
    
    # Default sentiment analysis using TextBlob
    blob = TextBlob(data.text)
    sentiment = blob.sentiment.polarity

    if sentiment > 0.1:
        label = "Positive"
    elif sentiment < -0.1:
        label = "Negative"
    else:
        label = "Neutral"

    return {"sentiment": label, "score": sentiment}
 
# cd backend
# python3 -m pip install fastapi uvicorn textblob
# python3 -m textblob.download_corpora
# python3 -m uvicorn ml_model:app --reload --port 8000
