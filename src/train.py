import pandas as pd
import re
import os
import joblib
import numpy as np
from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report
from transformers import pipeline

# 1. Load Data
DATA_PATH = os.path.join("..", "data", "edtech_complaints_dataset.csv")
MODEL_DIR = os.path.join("..", "models")
os.makedirs(MODEL_DIR, exist_ok=True)

df = pd.read_csv(DATA_PATH, encoding='utf-8', encoding_errors='replace')
df.dropna(subset=['raw_text', 'category'], inplace=True)

# 2. Text Cleaning Function
def clean_text(text: str) -> str:
    text = str(text).lower()
    text = re.sub(r'[^a-z\s]', ' ', text)     
    text = re.sub(r'\s+', ' ', text).strip()    
    return text

df['cleaned_text'] = df['raw_text'].apply(clean_text)

# 3. Features and Targets
X = df['cleaned_text']
y_cat = df['category']

# 4. Industry-Standard Regularized Pipeline
category_pipeline = Pipeline([
    ('tfidf', TfidfVectorizer(
        stop_words='english',
        ngram_range=(1, 2),
        min_df=2,           
        max_df=0.85,       
        sublinear_tf=True 
    )),
    ('clf', LogisticRegression(
        C=0.5,       
        class_weight='balanced',
        max_iter=1000,
        random_state=42
    ))
])

# 5. Evaluate Stability via 5-Fold Stratified Cross-Validation
print("--- Running 5-Fold Stratified Cross-Validation ---")
cv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
cv_scores = cross_val_score(category_pipeline, X, y_cat, cv=cv, scoring='f1_macro')

print(f"5-Fold Macro F1 Scores: {np.round(cv_scores, 4)}")
print(f"Mean F1 Score: {cv_scores.mean():.4f} (+/- {cv_scores.std():.4f})\n")

# 6. Train Final Production Model on Train/Test Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y_cat, test_size=0.2, random_state=42, stratify=y_cat
)

category_pipeline.fit(X_train, y_train)

print("--- Final Evaluation on Unseen Test Set ---")
y_pred_cat = category_pipeline.predict(X_test)
print(classification_report(y_test, y_pred_cat))

# 7. Save Regularized Pipeline
joblib.dump(category_pipeline, os.path.join(MODEL_DIR, "category_pipeline.pkl"))
print(f"Successfully saved robust category_pipeline.pkl to '{MODEL_DIR}/'")