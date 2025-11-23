from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import models, schemas, crud, database

# Tự động tạo bảng trong DB
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI()

# Cấu hình CORS (Để Web PHP gọi được)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Hàm lấy DB
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# === API KIỂM TRA ===
@app.get("/")
def read_root():
    return {"message": "Backend Event Management đang chạy!"}

# === API 1: LẤY DANH SÁCH SỰ KIỆN ===
@app.get("/events")
def read_events(db: Session = Depends(get_db)):
    events = crud.get_events(db)
    if events:
        return events
    
    # Dữ liệu giả (Nếu DB trống) - Đã cập nhật đầy đủ trường
    return [
        {
            "id": 1,
            "title": "Demo: Đại Nhạc Hội EDM",
            "description": "Sự kiện âm nhạc lớn nhất năm (Dữ liệu mẫu)",
            "date": "2025-12-31",
            "location": "Phố đi bộ Nguyễn Huệ",
            "capacity": 5000,
            "performers": "Sơn Tùng MTP, Mono"
        }
    ]

# === API 2: LẤY CHI TIẾT 1 SỰ KIỆN (MỚI THÊM) ===
@app.get("/events/{event_id}")
def read_event(event_id: int, db: Session = Depends(get_db)):
    db_event = crud.get_event(db, event_id=event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy sự kiện")
    return db_event

# === API 3: TẠO SỰ KIỆN MỚI (QUAN TRỌNG: MỚI THÊM) ===
@app.post("/events")
def create_event(event: schemas.EventCreate, db: Session = Depends(get_db)):
    return crud.create_event(db=db, event=event)

# === CÁC API AUTH (USER) ===
@app.post("/auth/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email đã tồn tại")
    return crud.create_user(db=db, user=user)

@app.post("/auth/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    user_found = crud.authenticate_user(db, user)
    if not user_found:
        raise HTTPException(status_code=401, detail="Sai thông tin đăng nhập")
    return {
        "access_token": f"token-{user_found.id}", 
        "user_info": {"name": user_found.full_name, "email": user_found.email}
    }