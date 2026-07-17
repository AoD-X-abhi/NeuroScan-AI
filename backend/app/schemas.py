from pydantic import BaseModel, EmailStr, Field
from typing import List, Dict, Optional
import datetime

class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: str = Field(min_length=1)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    role: str

    model_config = {"from_attributes": True}

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None
    user_id: Optional[int] = None

class PredictionResponse(BaseModel):
    id: int
    user_id: int
    mri_type: str
    prediction_class: str
    confidence: float
    inference_time: float
    timestamp: datetime.datetime
    image_path: str
    heatmap_path: str

    model_config = {"from_attributes": True}

class ChatRequest(BaseModel):
    message: str
    conversation_id: str

class ChatResponse(BaseModel):
    response: str
    sender: str
    timestamp: datetime.datetime

class ChatMessageResponse(BaseModel):
    id: int
    conversation_id: str
    sender: str
    message: str
    timestamp: datetime.datetime

    model_config = {"from_attributes": True}

class ModelStat(BaseModel):
    mri_type: str
    count: int

class AdminStatsResponse(BaseModel):
    total_users: int
    total_predictions: int
    model_stats: Dict[str, int]
    recent_predictions: List[PredictionResponse]

    model_config = {"from_attributes": True}
