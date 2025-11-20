from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

import models
import schemas
import crud
import database

# --- Tạo app FastAPI duy nhất ---
app = FastAPI(title="Event Manager")

# --- Middleware CORS ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Mount frontend ---
# Lưu ý: thư mục frontend phải tồn tại, chỉnh đường dẫn nếu khác
app.mount("/", StaticFiles(directory="../frontend", html=True), name="frontend")

# --- Tạo database nếu chưa có ---
models.Base.metadata.create_all(bind=database.engine)

# --- Dependency database ---
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Login giả lập ---
def login_user(email, password):
    if email == "admin@example.com" and password == "123456":
        return {"access_token": "fake_token_123", "token_type": "bearer"}
    return None

@app.post("/api/auth/login")
def login(data: dict):
    email = data.get("email")
    password = data.get("password")
    result = login_user(email, password)
    if result:
        return result
    return {"detail": "Sai thông tin đăng nhập"}, 401

# --- Routes Event ---
@app.get("/api/events", response_model=list[schemas.Event])
def read_events(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return crud.get_events(db, skip=skip, limit=limit)

@app.post("/api/events", response_model=schemas.Event)
def create_event(event: schemas.EventCreate, db: Session = Depends(get_db)):
    return crud.create_event(db, event)

@app.get("/api/events/{event_id}", response_model=schemas.Event)
def read_event(event_id: int, db: Session = Depends(get_db)):
    db_event = crud.get_event(db, event_id)
    if not db_event:
        raise HTTPException(status_code=404, detail="Event not found")
    return db_event
