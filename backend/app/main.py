from fastapi import FastAPI, Depends, HTTPException, status, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List
import os
import datetime

from .database import engine, get_db
from . import models, schemas, auth, predictor, chat, pdf_report

models.Base.metadata.create_all(bind=engine)

STATIC_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "static"))
os.makedirs(os.path.join(STATIC_DIR, "reports"), exist_ok=True)

app = FastAPI(title="NeuroScan AI Backend", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

@app.on_event("startup")
def seed_users():
    db = next(get_db())
    try:
        admin = db.query(models.User).filter(models.User.email == "admin@neuroscan.ai").first()
        if not admin:
            hashed_pw = auth.get_password_hash("admin123")
            new_admin = models.User(
                email="admin@neuroscan.ai",
                hashed_password=hashed_pw,
                full_name="Dr. Sarah Connor",
                role="admin"
            )
            db.add(new_admin)
            db.commit()
            print("Seeded admin account successfully.")
            
        doctor = db.query(models.User).filter(models.User.email == "doctor@neuroscan.ai").first()
        if not doctor:
            hashed_pw = auth.get_password_hash("doctor123")
            new_doctor = models.User(
                email="doctor@neuroscan.ai",
                hashed_password=hashed_pw,
                full_name="Dr. Abhishek",
                role="user"
            )
            db.add(new_doctor)
            db.commit()
            print("Seeded doctor account successfully.")
        else:
            if doctor.full_name == "Dr. Alex Mercer":
                doctor.full_name = "Dr. Abhishek"
                db.commit()
                print("Updated seeded doctor name to Dr. Abhishek.")
    except Exception as e:
        print(f"Error during seeding: {e}")
    finally:
        db.close()

@app.post("/api/auth/register", response_model=schemas.UserResponse)
def register(user_in: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = auth.get_password_hash(user_in.password)
    new_user = models.User(
        email=user_in.email,
        hashed_password=hashed_pw,
        full_name=user_in.full_name,
        role="user"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/api/auth/login", response_model=schemas.Token)
def login(user_in: schemas.UserLogin, db: Session = Depends(get_db)):
    user = db.query(models.User).filter(models.User.email == user_in.email).first()
    if not user or not auth.verify_password(user_in.password, user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect email or password")
    
    access_token = auth.create_access_token(data={"sub": user.email, "user_id": user.id})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me", response_model=schemas.UserResponse)
def get_me(current_user: models.User = Depends(auth.get_current_user)):
    return current_user

@app.delete("/api/auth/me")
def delete_me(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    # Delete physical MRI files and Grad-CAM overlays stored on disk
    predictions = db.query(models.Prediction).filter(models.Prediction.user_id == current_user.id).all()
    for pred in predictions:
        if pred.image_path:
            rel_image = pred.image_path.replace("/static/", "").lstrip("/")
            abs_image = os.path.join(STATIC_DIR, rel_image)
            if os.path.exists(abs_image):
                try:
                    os.remove(abs_image)
                except Exception:
                    pass
        if pred.heatmap_path:
            rel_heat = pred.heatmap_path.replace("/static/", "").lstrip("/")
            abs_heat = os.path.join(STATIC_DIR, rel_heat)
            if os.path.exists(abs_heat):
                try:
                    os.remove(abs_heat)
                except Exception:
                    pass
                    
        # Also clean up cached PDF report if exists
        report_filename = f"report_{pred.id}.pdf"
        abs_report = os.path.join(STATIC_DIR, "reports", report_filename)
        if os.path.exists(abs_report):
            try:
                os.remove(abs_report)
            except Exception:
                pass

    db.delete(current_user)
    db.commit()
    return {"detail": "Account deleted successfully"}

@app.post("/api/predict/{mri_type}", response_model=schemas.PredictionResponse)
async def predict_mri(mri_type: str, file: UploadFile = File(...), current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    if mri_type not in ["brain", "alzheimer", "spine"]:
        raise HTTPException(status_code=400, detail="Invalid MRI analysis type")
        
    file_bytes = await file.read()
    
    result = predictor.predictor.run_prediction(mri_type, file_bytes, file.filename)
    
    new_prediction = models.Prediction(
        user_id=current_user.id,
        mri_type=mri_type,
        prediction_class=result["prediction_class"],
        confidence=result["confidence"],
        inference_time=result["inference_time"],
        image_path=result["image_path"],
        heatmap_path=result["heatmap_path"]
    )
    db.add(new_prediction)
    db.commit()
    db.refresh(new_prediction)
    return new_prediction

@app.get("/api/history", response_model=List[schemas.PredictionResponse])
def get_prediction_history(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    if current_user.role == "admin":
        return db.query(models.Prediction).order_by(models.Prediction.timestamp.desc()).all()
    return db.query(models.Prediction).filter(models.Prediction.user_id == current_user.id).order_by(models.Prediction.timestamp.desc()).all()

@app.post("/api/chat", response_model=schemas.ChatResponse)
def chat_assistant(req: schemas.ChatRequest, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    api_key = os.getenv("GEMINI_API_KEY")
    bot_reply = chat.query_chat_assistant(req.message, api_key=api_key)
    
    user_msg = models.ChatMessage(
        user_id=current_user.id,
        conversation_id=req.conversation_id,
        sender="user",
        message=req.message
    )
    bot_msg = models.ChatMessage(
        user_id=current_user.id,
        conversation_id=req.conversation_id,
        sender="assistant",
        message=bot_reply
    )
    db.add(user_msg)
    db.add(bot_msg)
    db.commit()
    
    return {
        "response": bot_reply,
        "sender": "assistant",
        "timestamp": datetime.datetime.utcnow()
    }

@app.get("/api/chat/messages/{conversation_id}", response_model=List[schemas.ChatMessageResponse])
def get_chat_messages(conversation_id: str, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    return db.query(models.ChatMessage).filter(
        models.ChatMessage.user_id == current_user.id,
        models.ChatMessage.conversation_id == conversation_id
    ).order_by(models.ChatMessage.timestamp.asc()).all()

@app.get("/api/report/{prediction_id}")
def download_report(prediction_id: int, current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    pred = db.query(models.Prediction).filter(models.Prediction.id == prediction_id).first()
    if not pred:
        raise HTTPException(status_code=404, detail="Prediction record not found")
        
    if current_user.role != "admin" and pred.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this report")
        
    report_filename = f"report_{pred.id}.pdf"
    report_abs_path = os.path.join(STATIC_DIR, "reports", report_filename)
    
    if not os.path.exists(report_abs_path):
        patient_name = current_user.full_name if pred.user_id == current_user.id else "Patient Record"
        doctor_name = pred.user.full_name if pred.user else "Dr. Abhishek"
        pdf_report.generate_pdf_report(
            dest_pdf_path=report_abs_path,
            patient_name=patient_name,
            patient_id=f"PAT-{pred.user_id:04d}-{pred.id:04d}",
            mri_type=pred.mri_type,
            prediction_class=pred.prediction_class,
            confidence=pred.confidence,
            timestamp_str=pred.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
            inference_time=pred.inference_time,
            image_rel_path=pred.image_path,
            heatmap_rel_path=pred.heatmap_path,
            doctor_name=doctor_name
        )
        
    return FileResponse(report_abs_path, filename=report_filename, media_type="application/pdf")

@app.get("/api/admin/stats", response_model=schemas.AdminStatsResponse)
def get_admin_stats(current_user: models.User = Depends(auth.get_current_user), db: Session = Depends(get_db)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to access admin stats")
        
    total_users = db.query(models.User).count()
    total_predictions = db.query(models.Prediction).count()
    
    model_stats = {"brain": 0, "alzheimer": 0, "spine": 0}
    preds = db.query(models.Prediction.mri_type).all()
    for p in preds:
        mtype = p[0]
        if mtype in model_stats:
            model_stats[mtype] += 1
            
    recent_predictions = db.query(models.Prediction).order_by(models.Prediction.timestamp.desc()).limit(5).all()
    
    return {
        "total_users": total_users,
        "total_predictions": total_predictions,
        "model_stats": model_stats,
        "recent_predictions": recent_predictions
    }
