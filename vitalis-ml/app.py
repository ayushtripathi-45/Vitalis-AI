
import joblib
import pandas as pd

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
import json

app = FastAPI(title="Vitalis AI ML API")

# CORS CONFIGURATION
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5500",
        "http://127.0.0.1:5500"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# LOAD MODEL AND FEATURES
model = joblib.load("random_forest.pkl")
features = joblib.load("model_features.pkl")


class PredictionRequest(BaseModel):
    features: Dict[str, Any]


@app.get("/")
def home():
    return {
        "message": "Vitalis AI ML API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": model is not None
    }


@app.get("/features")
def get_features():
    return {
        "total_features": len(features),
        "features": features
    }


@app.post("/predict")
async def predict(request: Request):

    try:
        raw_body = await request.body()

        print("\n========== INCOMING PREDICTION REQUEST ==========")
        print("RAW REQUEST BODY:", raw_body)
        print("CONTENT TYPE:", request.headers.get("content-type"))
        print("CONTENT LENGTH:", request.headers.get("content-length"))

        if not raw_body:
            raise HTTPException(
                status_code=400,
                detail="Request body is empty"
            )

        request_data = json.loads(raw_body)

        prediction_request = PredictionRequest(**request_data)

        input_data = prediction_request.features.copy()

        print("Received features:", len(input_data))

        if "SEX" in input_data:
            input_data["SEX"] = {
                "M": 0,
                "F": 1
            }.get(input_data["SEX"], input_data["SEX"])

        input_df = pd.DataFrame(
            [[input_data.get(feature, 0) for feature in features]],
            columns=features
        )

        input_df = input_df.fillna(0)

        prediction = model.predict(input_df)[0]

        probabilities = model.predict_proba(input_df)[0]

        confidence = float(max(probabilities)) * 100

        print("Predicted disease:", prediction)
        print("Confidence:", round(confidence, 2))
        print("=================================================\n")

        return {
            "predicted_disease": str(prediction),
            "confidence": round(confidence, 2)
        }

    except HTTPException:
        raise

    except json.JSONDecodeError:
        raise HTTPException(
            status_code=400,
            detail="Invalid JSON request body"
        )

    except Exception as e:
        print("Prediction error:", str(e))

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
