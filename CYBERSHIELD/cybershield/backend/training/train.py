import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import confusion_matrix, classification_report, accuracy_score
import joblib
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

# Load dataset
df = pd.read_csv("../dataset/cyber_risk_data.csv")

# Features & Labels
X = df[['threat_level', 'vulnerability_score', 'impact_factor']]
y = df['risk_category']

# Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Train Model
model = RandomForestClassifier(n_estimators=100)
model.fit(X_train, y_train)

# Save Model
joblib.dump(model, "cyber_risk_model.joblib")
print("✅ Model Trained & Saved!")

# Make Predictions
y_pred = model.predict(X_test)

# Accuracy and Loss Curve (Plotting)
train_accuracies = []
test_accuracies = []
train_losses = []
test_losses = []
for i in range(1, 101):  # Tracking accuracy and loss for each estimator
    model = RandomForestClassifier(n_estimators=i)
    model.fit(X_train, y_train)
    train_accuracy = model.score(X_train, y_train)
    test_accuracy = model.score(X_test, y_test)
    train_loss = 1 - train_accuracy
    test_loss = 1 - test_accuracy
    train_accuracies.append(train_accuracy)
    test_accuracies.append(test_accuracy)
    train_losses.append(train_loss)
    test_losses.append(test_loss)

# Plotting the combined curve
plt.figure(figsize=(16, 16))
plt.plot(range(1, 101), [acc * 100 for acc in test_accuracies], marker='o', color='b', label='Test Accuracy (%)')
plt.plot(range(1, 101), [acc * 100 for acc in train_accuracies], marker='o', color='g', label='Train Accuracy (%)')
plt.plot(range(1, 101), test_losses, marker='o', color='r', label='Test Loss')
plt.plot(range(1, 101), train_losses, marker='o', color='orange', label='Train Loss')
plt.title('Training & Testing Accuracy and Loss Curve')
plt.xlabel('Number of Estimators')
plt.ylabel('Value')
plt.legend()

# Adding subtitles for both accuracies in one line and both losses in another line
plt.figtext(0.5, 0.95, f'Training Accuracy: {train_accuracies[-1] * 100:.2f}%  |  Testing Accuracy: {test_accuracies[-1] * 100:.2f}%', ha='center', va='top', fontsize=12, color='green')
plt.figtext(0.5, 0.92, f'Training Loss: {train_losses[-1]:.2f}  |  Testing Loss: {test_losses[-1]:.2f}', ha='center', va='top', fontsize=12, color='orange')

plt.grid(True)
plt.savefig("accuracy_and_loss_curve.png")  # Save the combined curve plot as an image
plt.close()

# Confusion Matrix (Plotting)
cm = confusion_matrix(y_test, y_pred)
plt.figure(figsize=(10, 6))
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', xticklabels=np.unique(y), yticklabels=np.unique(y))
plt.title('Confusion Matrix')
plt.xlabel('Predicted')
plt.ylabel('Actual')
plt.savefig("confusion_matrix.png")  # Save the confusion matrix as an image
plt.close()

# Classification Report (Plotting)
report = classification_report(y_test, y_pred, output_dict=True)
report_df = pd.DataFrame(report).transpose()
plt.figure(figsize=(10, 6))
sns.heatmap(report_df.iloc[:-1, :].T, annot=True, cmap='Blues', cbar=False)
plt.title('Classification Report')
plt.savefig("classification_report.png")  # Save the classification report as an image
plt.close()
