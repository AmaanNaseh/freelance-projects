import pandas as pd
from mlxtend.frequent_patterns import apriori, association_rules
import joblib
import os

# Load Excel
df = pd.read_excel("data/indian_dishes.xlsx", header=None)

# Convert to transactions
transactions = df.apply(lambda x: x.dropna().tolist(), axis=1).tolist()

# Create list of all items
all_items = sorted(set(item for transaction in transactions for item in transaction))

# One-hot encoding
encoded_data = []
for transaction in transactions:
    row = {item: (item in transaction) for item in all_items}
    encoded_data.append(row)

df_encoded = pd.DataFrame(encoded_data)

# Generate frequent itemsets
frequent_itemsets = apriori(df_encoded, min_support=0.05, use_colnames=True)

# Generate rules
rules = association_rules(frequent_itemsets, metric="lift", min_threshold=1)

# Save rules to joblib
os.makedirs("model", exist_ok=True)
joblib.dump(rules, "model/dish_recommender.joblib")

print("Model trained and saved as 'model/dish_recommender.joblib'")
