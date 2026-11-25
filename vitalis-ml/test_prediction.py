
import joblib
import json
import urllib.request

features = joblib.load("model_features.pkl")

# Create test input using the exact model features
input_data = {feature: 0 for feature in features}

# Set sample demographic values
if "AGE" in input_data:
    input_data["AGE"] = 25

if "SEX" in input_data:
    input_data["SEX"] = "M"

payload = json.dumps({
    "features": input_data
}).encode("utf-8")

request = urllib.request.Request(
    "http://127.0.0.1:8000/predict",
    data=payload,
    headers={"Content-Type": "application/json"},
    method="POST"
)

try:
    with urllib.request.urlopen(request) as response:
        result = json.loads(response.read().decode("utf-8"))
        print("Prediction Result:")
        print(json.dumps(result, indent=4))

except Exception as e:
    print("Error:", e)
