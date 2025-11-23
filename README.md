# Event Management - Full Code (FastAPI backend + PHP frontend)

## Backend (FastAPI)
- Location: backend/app
- Run:
    1. Create virtual env and install: `pip install -r backend/requirements.txt`
    2. Run server: `uvicorn app.main:app --reload --port 8000 --host 127.0.0.1`
    3. API endpoints:
        - GET /health
        - GET /events
        - POST /events
        - GET /events/{id}

## Frontend (PHP)
- Location: frontend/
- Move the frontend folder to your PHP web root (e.g., XAMPP `htdocs/event-management/` or open with PHP's built-in server).
- config.php contains the API_URL constant. Change it if backend runs on different host/port.
- Example:
    - Using PHP built-in server: `php -S 127.0.0.1:8080 -t frontend`
    - Then open: http://127.0.0.1:8080/index.php

## Notes
- Backend uses SQLite file created at backend/app/events.db (created on first run).
- Frontend calls the backend API with fetch() in index.php and with PHP cURL in events.php.
