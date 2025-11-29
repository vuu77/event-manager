from database import engine
import models

print("--- ĐANG TẠO DATABASE... ---")

# Lệnh này sẽ quét file models.py và tạo các bảng (User, Event...)
models.Base.metadata.create_all(bind=engine)

print("--- ĐÃ TẠO XONG FILE sql_app.db! KIỂM TRA LẠI THƯ MỤC ĐI ---")