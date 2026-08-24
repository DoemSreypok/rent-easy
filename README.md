# RentEasy (Full-Stack Application)

A full-stack application with an **Angular** frontend and a **Node.js / Express + MongoDB** backend.

---

## 🛠️ Quick Start

### 1. Start the Backend Server (Express + MongoDB)
```bash
cd backend
npm install
npm run dev
```
- Backend runs on: **`http://localhost:5000`**
- API health check: **`http://localhost:5000/api/health`**
- Configured in: [backend/.env](file:///Users/fedora/Desktop/Pok/rent-easy/backend/.env)

### 2. Start the Frontend Application (Angular)
In a separate terminal:
```bash
cd frontend
npm install
npm start
```
- Frontend runs on: **`http://localhost:4200`**

---

## 📁 Project Architecture

```
rent-easy/
├── backend/
│   ├── .env                    # Server port, MongoDB URI & CORS origin
│   ├── package.json
│   └── src/
│       ├── config/db.js        # MongoDB Mongoose connection
│       ├── models/item.model.js # Mongoose schema for Rental Items
│       ├── routes/api.routes.js # REST API endpoints (/api/health, /api/items)
│       └── server.js           # Express app & CORS middleware
│
└── frontend/
    ├── proxy.conf.json         # Dev proxy configuration
    └── src/
        ├── environments/       # Environment configs (apiUrl)
        └── app/
            ├── app.config.ts   # provideHttpClient() setup
            ├── app.ts          # Root component with reactive signals & state
            ├── app.html        # UI with status badges & rental item CRUD
            ├── app.css         # UI styles
            └── services/
                └── api.service.ts # Angular service communicating with backend
```

---

## 📡 API Endpoints

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Backend & Database connection status |
| `GET` | `/api/items` | Fetch all rental items from MongoDB |
| `POST` | `/api/items` | Add a new rental item |
| `DELETE` | `/api/items/:id` | Delete a rental item by ID |
