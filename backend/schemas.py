from pydantic import BaseModel
from typing import Optional, List

# --- Event ---
class EventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    location: Optional[str] = None
    date: Optional[str] = None
    capacity: Optional[int] = 100
    performers: Optional[str] = None

class Event(EventCreate):
    id: int
    class Config:
        from_attributes = True

# --- User ---
class UserCreate(BaseModel):
    full_name: str
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class UserOut(BaseModel):
    id: int
    full_name: str
    email: str
    class Config:
        from_attributes = True