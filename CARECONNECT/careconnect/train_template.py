# Import necessary libraries
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.pipeline import make_pipeline
from sklearn.metrics import classification_report
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
import re

# Load dataset
data = pd.read_csv('dataset.csv')

# Preprocessing: Tokenize symptoms
nltk.download('punkt')
nltk.download('punkt_tab')  # Add this line
nltk.download('stopwords')
stop_words = set(stopwords.words('english'))

# Tokenizing function to preprocess the symptoms
def tokenize(text):
    text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
    tokens = word_tokenize(text.lower())  # Tokenize and convert to lowercase
    tokens = [word for word in tokens if word not in stop_words]  # Remove stopwords
    return tokens

# Apply tokenization on symptoms column
data['tokens'] = data['symptoms'].apply(tokenize)
data['symptoms'] = data['tokens'].apply(lambda x: ' '.join(x))

# Splitting the data
X = data['symptoms']
y = data['disease']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Create the machine learning pipeline with CountVectorizer and Random Forest
model = make_pipeline(CountVectorizer(), RandomForestClassifier())

# Train the model
model.fit(X_train, y_train)

# Evaluate the model
y_pred = model.predict(X_test)
print(classification_report(y_test, y_pred))

import joblib

# Save the model
joblib.dump(model, 'disease_predictor_model.joblib')
