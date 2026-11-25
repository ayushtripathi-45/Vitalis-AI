
import pandas as pd
import joblib

df = pd.read_csv("train.csv")
features = joblib.load("model_features.pkl")

for feature in features:
    print("\nFeature:", feature)
    print("Data type:", df[feature].dtype)
    print("Unique values:", df[feature].dropna().unique()[:15])
