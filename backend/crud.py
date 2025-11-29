from sqlalchemy.orm import Session
import models, schemas

# --- USER LOGIC ---
def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    # Lưu ý: Ở đây làm đơn giản chưa mã hóa pass để bạn dễ test
    db_user = models.User(email=user.email, full_name=user.full_name, password=user.password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, user: schemas.UserLogin):
    db_user = get_user_by_email(db, user.email)
    if not db_user:
        return None
    if db_user.password != user.password:
        return None
    return db_user

# --- EVENT LOGIC ---
def get_events(db: Session):
    return db.query(models.Event).all()

def get_event(db: Session, event_id: int):
    return db.query(models.Event).filter(models.Event.id == event_id).first()

# --- Dán vào cuối file backend/crud.py ---

def create_event(db: Session, event: schemas.EventCreate, user_id: int):
    db_event = models.Event(
        title=event.title,
        description=event.description,
        date=event.date,
        location=event.location,
        capacity=event.capacity,
        image_url=event.image_url, 
        organizer_id=user_id 
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event
# Hàm lấy tất cả người dùng trong hệ thống
def get_all_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

# Hàm lấy thông tin của một người dùng theo ID
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()