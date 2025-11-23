from sqlalchemy.orm import Session
import models, schemas
import bcrypt # Dùng thư viện bcrypt trực tiếp cho lành

# --- PHẦN USER ---

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    # 1. Mã hóa mật khẩu (Hash)
    # Chuyển password sang bytes rồi băm
    pwd_bytes = user.password.encode('utf-8')
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(pwd_bytes, salt)
    
    # Chuyển ngược lại thành string để lưu vào DB
    hashed_password_str = hashed_password.decode('utf-8')

    # 2. Lưu vào Database
    # QUAN TRỌNG: Cột trong model tên là "password", nên ở đây phải gán vào "password"
    db_user = models.User(
        email=user.email, 
        full_name=user.full_name, 
        password=hashed_password_str 
    )
    
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def authenticate_user(db: Session, user: schemas.UserLogin):
    # 1. Tìm user theo email
    db_user = get_user_by_email(db, user.email)
    if not db_user:
        return False
    
    # 2. Kiểm tra mật khẩu
    # db_user.password là mật khẩu đã mã hóa trong DB
    user_password_bytes = user.password.encode('utf-8')
    db_password_bytes = db_user.password.encode('utf-8')

    if bcrypt.checkpw(user_password_bytes, db_password_bytes):
        return db_user
    return False

# --- PHẦN EVENT ---

def get_events(db: Session):
    return db.query(models.Event).all()

def get_event(db: Session, event_id: int):
    return db.query(models.Event).filter(models.Event.id == event_id).first()

def create_event(db: Session, event: schemas.EventCreate):
    db_event = models.Event(
        title=event.title,
        description=event.description,
        location=event.location,
        date=event.date,
        capacity=event.capacity,
        performers=event.performers
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event