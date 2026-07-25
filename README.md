# 🚀 LearnSphere: Customer Complaint Intelligence

An intelligent, full-stack Customer Complaint Intelligence system that automates complaint categorization, emotion detection, and ticket routing using Natural Language Processing (NLP). The platform helps organizations prioritize critical issues, filter spam, and provide a modern dashboard for customer support teams.

---

# ✨ Features

- 🤖 **Automated Complaint Categorization**
  - Classifies complaints into departments such as IT, Finance, Engineering, HR, etc.

- 😊 **Emotion & Sentiment Analysis**
  - Uses **DistilRoBERTa** to detect emotions like Anger, Fear, Sadness, Joy, and Neutral.
  - Automatically marks highly negative complaints as **Critical Priority**.

- 🚫 **Spam & Gibberish Detection**
  - Filters random chats, keyboard smashes, greetings, and test messages before they reach support agents.

- 📊 **Interactive Dashboard**
  - Modern React dashboard with:
    - Global Search
    - Department Filter
    - Priority Filter
    - Complaint Statistics
    - Responsive UI

- ⚡ **Fast REST API**
  - Built using FastAPI for high-performance complaint processing.

---

# 🛠 Tech Stack

## Frontend
- React.js (Vite)
- Tailwind CSS
- Lucide React

## Backend
- FastAPI
- Python
- Pydantic

## Database
- MongoDB

## Machine Learning
- Scikit-Learn
- TF-IDF Vectorizer
- Hugging Face Transformers
- Joblib

---

# 📂 Project Structure

```text
customer-complaint-intelligence/
│
├── backend/
│   ├── main.py
│   └── requirements.txt
│
├── data/
│   └── edtech_complaints_dataset.csv
│
├── frontend/
│   └── src/
│       ├── components/
│       └── App.jsx
│
├── models/
│   └── category_pipeline.pkl
│
└── src/
    └── train.py
```

---

# ⚙️ Setup & Installation

## 1️⃣ Clone the Repository

```bash
git clone <repository-url>
cd customer-complaint-intelligence
```

---

## 2️⃣ Start MongoDB

Make sure **MongoDB** is installed and running locally.

Default Port:

```text
27017
```

---

## 3️⃣ Setup the Backend

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Linux / macOS
source venv/bin/activate

pip install -r requirements.txt
```

---

## 4️⃣ Train the Machine Learning Model

Before starting the backend for the first time, generate the trained model (`category_pipeline.pkl`).

Navigate back to the project root and run:

```bash
cd ..

python src/train.py
```

After successful execution, a new file will be generated:

```text
models/
└── category_pipeline.pkl
```

This trained model is required by the backend for complaint category prediction.

---

## 5️⃣ Start the Backend Server

```bash
cd backend

python -m uvicorn main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

Swagger API Documentation:

```text
http://127.0.0.1:8000/docs
```

---

## 6️⃣ Start the Frontend

Open another terminal.

```bash
cd frontend

npm install

npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

# 📌 Workflow

```text
Customer Complaint
        │
        ▼
 Complaint Categorization
        │
        ▼
 Emotion Detection
        │
        ▼
 Spam Filtering
        │
        ▼
 Priority Assignment
        │
        ▼
 Store in MongoDB
        │
        ▼
 React Dashboard
```

---

# 🎯 Project Highlights

- Automated complaint categorization
- Emotion-aware ticket prioritization
- Spam & gibberish message filtering
- Interactive support dashboard
- FastAPI REST backend
- MongoDB database integration
- Machine Learning powered predictions
- Modern React + Tailwind CSS interface
