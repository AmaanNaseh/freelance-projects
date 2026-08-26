import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from joblib import dump

# Load or generate dataset
np.random.seed(42)
n_samples = 1000

data = {
    "age": np.random.randint(20, 80, size=n_samples),
    "bmi": np.round(np.random.uniform(18, 40, size=n_samples), 1),
    "hypertension": np.random.randint(0, 2, size=n_samples),
    "cholesterol": np.random.randint(0, 2, size=n_samples),
    "exercise": np.random.randint(0, 2, size=n_samples),
    "sugar_intake": np.random.randint(0, 3, size=n_samples),
    "family_history": np.random.randint(0, 2, size=n_samples),
    "symptoms": np.random.randint(0, 2, size=n_samples),
    "smoker": np.random.randint(0, 2, size=n_samples),
}

df = pd.DataFrame(data)

# Create target variable: Diabetes Risk
df["diabetes"] = (
    (df["age"] > 50).astype(int) +
    (df["bmi"] > 30).astype(int) +
    df["hypertension"] +
    df["cholesterol"] +
    (df["exercise"] == 0).astype(int) +
    (df["sugar_intake"] >= 2).astype(int) +
    df["family_history"] +
    df["symptoms"]
) >= 4
df["diabetes"] = df["diabetes"].astype(int)

# Features and target
X = df.drop("diabetes", axis=1)
y = df["diabetes"]

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train model
clf = RandomForestClassifier(n_estimators=100, random_state=42)
clf.fit(X_train, y_train)

# Predictions and accuracy
y_pred = clf.predict(X_test)
acc = accuracy_score(y_test, y_pred)

# Save model
dump(clf, "diabetes_model.joblib")

# Accuracy bar plot (only one model)
plt.figure(figsize=(10, 5))
sns.barplot(x=["Random Forest"], y=[acc])
plt.xlabel("Model")
plt.ylabel("Accuracy")
plt.title("Model Comparison")
plt.ylim(0, 1)  # Accuracy between 0 and 1
plt.tight_layout()
plt.savefig("model_comparison.png")
plt.close()

# Confusion matrix plot
conf_matrix = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(10, 10))  # Adjust size (similar to your original 30x30 but smaller for tabular)
sns.heatmap(conf_matrix, annot=True, fmt="d", cmap="Blues",
            xticklabels=["No Diabetes", "Diabetes"],
            yticklabels=["No Diabetes", "Diabetes"])
plt.title("Confusion Matrix")
plt.xlabel("Predicted Label")
plt.ylabel("True Label")
plt.tight_layout()
plt.savefig("confusion_matrix.png")
plt.close()

# Classification report
report = classification_report(y_test, y_pred, zero_division=1)
with open("classification_report.txt", "w") as f:
    f.write(report)

print(f"Model trained and saved. Accuracy: {acc:.4f}")
