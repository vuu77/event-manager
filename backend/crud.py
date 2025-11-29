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

def create_event(db: Session, event: schemas.EventCreate):
    db_event = models.Event(
        title=event.title,
        description=event.description,
        date=event.date,
        location=event.location,
        capacity=event.capacity,
        performers=event.performers
    )
    db.add(db_event)
    db.commit()
    db.refresh(db_event)
    return db_event