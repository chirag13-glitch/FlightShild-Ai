import pandas as pd

# load dataset
data = pd.read_csv("data/turbulence_data.csv")

# show dataset
print("Dataset Preview:")
print(data)

# show first rows
print("\nFirst 5 rows:")
print(data.head())
