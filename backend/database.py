from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import urllib.parse

# 1. CẤU HÌNH THÔNG TIN KẾT NỐI
SERVER = r'TRUNGNGUYEN\SQLEXPRESS' # <-- Thay tên Server của bạn vào đây (xem hướng dẫn lấy tên bên dưới)
DATABASE = 'ERPVietDB'             # Tên database bạn vừa tạo script
USERNAME = 'sa'                    # Tài khoản đăng nhập SQL
PASSWORD = '26102002'         # Mật khẩu SQL của bạn

# Mã hóa mật khẩu để tránh lỗi ký tự đặc biệt (@, /...)
encoded_password = urllib.parse.quote_plus(PASSWORD)

# 2. TẠO CHUỖI KẾT NỐI (CONNECTION STRING)
# Lưu ý: Driver thường là 'ODBC Driver 17 for SQL Server'
SQLALCHEMY_DATABASE_URL = f"mssql+pyodbc://{USERNAME}:{encoded_password}@{SERVER}/{DATABASE}?driver=ODBC+Driver+17+for+SQL+Server"

# 3. KHỞI TẠO ENGINE
engine = create_engine(SQLALCHEMY_DATABASE_URL)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()