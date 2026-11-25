
import pandas as pd

df = pd.read_csv("Train.csv")

feature_columns = [
    col for col in df.columns
    if col.startswith("E_")
]

non_binary = {}

for col in feature_columns:
    values = sorted(df[col].dropna().unique().tolist())

    if not set(values).issubset({0, 1}):
        non_binary[col] = values

print("Total E features:", len(feature_columns))
print("Binary features:", len(feature_columns) - len(non_binary))
print("Non-binary features:", len(non_binary))

for col, values in non_binary.items():
    print(col, ":", values)
