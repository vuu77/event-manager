from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from pydantic import BaseModel
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from sqlalchemy.exc import IntegrityError


# Import các file nội bộ
import models, schemas, crud, database

# --- 1. HÀM TẠO NỘI DUNG EMAIL (Đã gộp vào đây) ---
def tao_noi_dung_email(user_name, event_title, time, location, qr_url=None):
    qr_section = ""
    if qr_url:
        qr_section = f"""
        <div style="text-align: center; margin: 20px 0;">
            <img src="{qr_url}" alt="QR Code" style="width: 150px; height: 150px; border: 2px solid #333; padding: 5px;">
        </div>
        """
    return f"""
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px;">
            <div style="background-color: #6f42c1; color: white; padding: 20px; text-align: center;">
                <h2>VÉ ĐIỆN TỬ</h2>
            </div>
            <div style="padding: 20px;">
                <p>Xin chào <strong>{user_name}</strong>,</p>
                <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px;">
                    <h3 style="color: #6f42c1; margin-top: 0;">{event_title}</h3>
                    <p><strong>🕒 Thời gian:</strong> {time}</p>
                    <p><strong>📍 Địa điểm:</strong> {location}</p>
                </div>
                {qr_section}
                <p>Vui lòng xuất trình email này khi check-in.</p>
            </div>
        </div>
    </body>
    </html>
    """

# --- CẤU HÌNH DATABASE ---
models.Base.metadata.create_all(bind=database.engine)

# --- CẤU HÌNH EMAIL (THAY CỦA BẠN VÀO ĐÂY) ---
SENDER_EMAIL = "23050166@student.bdu.edu.vn"  # <--- THAY EMAIL CỦA BẠN
SENDER_PASSWORD = "vu18072005@"     # <--- THAY PASS ỨNG DỤNG

app = FastAPI()

# Cấu hình CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Hàm kiểm tra Token đơn giản
def verify_token(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer token-"):
        raise HTTPException(status_code=401, detail="Bạn chưa đăng nhập hoặc Token không hợp lệ")
    try:
        user_id = authorization.split("-")[1]
        return user_id
    except:
        raise HTTPException(status_code=401, detail="Token lỗi")

# === API USERS ===
@app.post("/auth/register", response_model=schemas.UserOut)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    # Bọc trong try-except để bắt lỗi trùng lặp
    try:
        # Thử tạo user
        return crud.create_user(db=db, user=user)
    except IntegrityError:
        # Nếu trùng email -> Database báo lỗi -> Code nhảy vào đây
        db.rollback() # Hoàn tác
        raise HTTPException(status_code=400, detail="Email này đã được sử dụng")
    except Exception as e:
        # Các lỗi khác
        db.rollback()
        print(f"Lỗi Server: {e}")
        raise HTTPException(status_code=500, detail="Lỗi hệ thống")
       

@app.post("/auth/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):
    user_found = crud.authenticate_user(db, user)
    if not user_found:
        raise HTTPException(status_code=401, detail="Sai tài khoản hoặc mật khẩu")
    return {
        "access_token": f"token-{user_found.id}", 
        "user_info": {"name": user_found.full_name, "email": user_found.email}
    }

# === API EVENTS ===
@app.get("/events")
def read_events(db: Session = Depends(get_db)):
    return crud.get_events(db)

@app.get("/events/{event_id}")
def read_event(event_id: int, db: Session = Depends(get_db)):
    db_event = crud.get_event(db, event_id=event_id)
    if db_event is None:
        raise HTTPException(status_code=404, detail="Không tìm thấy sự kiện")
    return db_event

@app.post("/events")
def create_event(
    event: schemas.EventCreate, 
    db: Session = Depends(get_db),
    user_id: str = Depends(verify_token) # Bảo vệ API này
):
    return crud.create_event(db=db, event=event)

# === API BOOKING (ĐẶT VÉ) ===
class BookingRequest(BaseModel):
    name: str
    phone: str
    email: str
    quantity: int
    total_price: int
    event_id: int 

@app.post("/bookings/send-email")
def create_booking(booking: BookingRequest, db: Session = Depends(get_db)):
    # 1. Lưu vào Database
    try:
        new_booking = models.Booking(
            customer_name=booking.name,
            customer_phone=booking.phone,
            customer_email=booking.email,
            quantity=booking.quantity,
            total_price=booking.total_price,
            event_id=booking.event_id
        )
        db.add(new_booking)
        db.commit()
    except Exception as e:
        print(f"Lỗi DB: {e}")
        return {"message": "Lỗi khi lưu Database"}

    # 2. Lấy thông tin Sự kiện để gửi Email
    event_info = crud.get_event(db, booking.event_id)
    if not event_info:
        return {"message": "Lưu thành công nhưng không tìm thấy sự kiện để gửi mail"}

    # 3. Gửi Email
    try:
        html_content = tao_noi_dung_email(
            user_name=booking.name,
            event_title=event_info.title,
            time=event_info.date,
            location=event_info.location
        )

        msg = MIMEMultipart()
        msg['From'] = SENDER_EMAIL
        msg['To'] = booking.email
        msg['Subject'] = f"Vé tham dự: {event_info.title}"
        msg.attach(MIMEText(html_content, 'html'))

        server = smtplib.SMTP('smtp.gmail.com', 587)
        server.starttls()
        server.login(SENDER_EMAIL, SENDER_PASSWORD)
        server.send_message(msg)
        server.quit()
        return {"message": "Success"}
    except Exception as e:
        print(f"Lỗi Email: {e}")
        return {"message": "Saved but Email failed"}