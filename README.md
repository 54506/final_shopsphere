# ShopSphere Installation Guide

Follow these steps to set up the project locally after cloning.

---

## 1. Backend Setup (Django)

1. **Navigate to the backend directory**:
   ```bash
   cd backend
   ```

2. **Create a Virtual Environment**:
   - **Windows**:
     ```bash
     python -m venv venv
     .\venv\Scripts\activate
     ```
   - **Mac/Linux**:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Install Dependencies**:
   ```bash
   pip install django djangorestframework django-cors-headers djangorestframework-simplejwt Pillow whitenoise dj-database-url gunicorn
   ```

4. **Apply Database Migrations**:
   ```bash
   python manage.py migrate
   ```

5. **Start the Backend Server**:
   ```bash
   python manage.py runserver
   ```
   *Server runs at: http://127.0.0.1:8000*

---

## 2. User Frontend Setup (React + Vite)

1. **Navigate to the user-frontend directory**:
   ```bash
   cd ../user-frontend
   ```

2. **Install Packages**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Ensure `VITE_API_BASE_URL` is set to `http://127.0.0.1:8000`.

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

---

## 3. Admin Service Setup (React + Vite)

1. **Navigate to the admin-service directory**:
   ```bash
   cd ../admin-service
   ```

2. **Install Packages**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Ensure `VITE_API_BASE_URL` is set to `http://127.0.0.1:8000`.

4. **Start Development Server**:
   ```bash
   npm run dev
   ```

---

## 🛡️ Note on CORS
The backend is pre-configured to allow requests from local Vite ports (5173-5177). If your frontend runs on a different port, update `CORS_ALLOWED_ORIGINS` in `backend/ShopSphere/settings.py`.
