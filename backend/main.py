from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from datetime import datetime
import joblib
import os
from transformers import pipeline
from pymongo import MongoClient
from fastapi.middleware.cors import CORSMiddleware

# --- 1. Initialize FastAPI ---
app = FastAPI(title="Customer Complaint Intelligence API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. Database Connection ---
MONGO_URI = "mongodb://localhost:27017/"
client = MongoClient(MONGO_URI)
db = client["edtech_intelligence"]
collection = db["tickets"]

# --- 3. Load ML Models ---
MODEL_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'models'))

print("Loading Scikit-Learn Category Pipeline...")
category_model = joblib.load(os.path.join(MODEL_DIR, "category_pipeline.pkl"))

print("Loading Hugging Face Emotion Pipeline...")
emotion_model = pipeline(
    "text-classification", 
    model="j-hartmann/emotion-english-distilroberta-base", 
    top_k=1
)

# --- 4. Pydantic Schemas ---
class ComplaintRequest(BaseModel):
    student_id: str
    raw_text: str

class ComplaintResponse(BaseModel):
    ticket_id: str
    category: str
    department: str
    emotion: str
    priority: str
    suggested_action: str

# --- 5. Business Logic Routing ---
DEPARTMENT_MAP = {
    'Authentication & Access': 'IT Support',
    'Billing & Subscriptions': 'Finance',
    'Platform Bugs & UI': 'Engineering',
    'Content & Academic': 'Content Team',
    'Certificates & Progress': 'Student Success',
    'Spam & General Chat': 'Automated Filter' 
}

def determine_priority_and_action(category: str, emotion: str) -> tuple:
    if category == 'Spam & General Chat':
        return "Low", "Auto-archived: Message flagged as out-of-domain or casual chat."

    priority = "Medium"
    action = "Review ticket and respond within 24 hours."

    if emotion in ['anger', 'disgust']:
        priority = "High"
        action = "Urgent: De-escalate customer. Review logs immediately."

    if category == 'Billing & Subscriptions':
        priority = "Critical"
        action = "Check Stripe/payment gateway logs for duplicate charges or failures."
    elif category == 'Authentication & Access' and emotion == 'anger':
        priority = "Critical"
        action = "Force password reset email and check for account lockouts."
        
    return priority, action

# --- 6. API Endpoints ---
@app.post("/api/v1/analyze-ticket", response_model=ComplaintResponse)
async def analyze_and_store_ticket(request: ComplaintRequest):
    try:
        raw_text = request.raw_text.strip()

        predicted_category = category_model.predict([raw_text])[0]
        department = DEPARTMENT_MAP.get(predicted_category, "General Support") 

        emotion_result = emotion_model(raw_text)
        detected_emotion = emotion_result[0][0]['label'] 

        priority, action = determine_priority_and_action(predicted_category, detected_emotion)

        ticket_document = {
            "ticket_info": {
                "student_id": request.student_id,
                "raw_text": raw_text,
                "created_at": datetime.utcnow(),
                "status": "OPEN"
            },
            "nlp_analysis": {
                "category": predicted_category,
                "department_routing": department,
                "emotion": detected_emotion,
                "priority": priority
            },
            "ai_insight": {
                "suggested_action": action
            }
        }

        result = collection.insert_one(ticket_document)

        return ComplaintResponse(
            ticket_id=str(result.inserted_id),
            category=predicted_category,
            department=department,
            emotion=detected_emotion,
            priority=priority,
            suggested_action=action
        )

    except Exception as e:
        print(f"ERROR in analyze_and_store_ticket: {str(e)}") 
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/tickets")
async def get_all_tickets():
    try:
        cursor = collection.find().sort("ticket_info.created_at", -1)
        
        tickets = []
        for doc in cursor:
            doc["_id"] = str(doc["_id"])
            tickets.append(doc)
            
        return {"status": "success", "data": tickets}
    except Exception as e:
        print(f"ERROR in get_all_tickets: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))