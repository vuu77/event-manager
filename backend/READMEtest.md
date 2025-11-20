
# Event Management (nhỏ)

Ứng dụng mẫu gồm một backend bằng **FastAPI** (SQLite) và một frontend tĩnh (HTML/CSS/JS).

**Yêu cầu**
- Python 3.8+

**Cài đặt (PowerShell)**

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r backend\requirements.txt
```

**Chạy backend**

Từ thư mục gốc `d:\event-management`:

```powershell
python -m uvicorn backend.main:app --reload --host 127.0.0.1 --port 8000
```

API chính:
- `GET /events` — lấy danh sách sự kiện
- `POST /events` — tạo sự kiện (JSON: `title`, `description`, `location`, `date`)
- `DELETE /events/{id}` — xóa sự kiện

SQLite DB file: `backend/events.db` (tự tạo khi chạy lần đầu).

**Chạy frontend**

Mở file `frontend/index.html` trực tiếp trong trình duyệt, hoặc serve tĩnh:

```powershell
cd frontend
python -m http.server 8001
# rồi mở http://127.0.0.1:8001/index.html
```

**Lưu ý**
- Nếu PowerShell chặn chạy script khi activate venv, bạn có thể chạy `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` (cần quyền admin) hoặc dùng Command Prompt để kích hoạt.
- Nếu cần, mình có thể giúp cài đặt và chạy server trên máy của bạn.

