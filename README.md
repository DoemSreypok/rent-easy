# RentEasy — Multi-Role Rental Platform

A modern full-stack rental platform built with an **Angular (Standalone Components + RxJS)** frontend and a **Node.js / Express + MongoDB (Mongoose ODM)** backend.

---

## 👥 User Roles & Permissions

| Role | Access Level | Description |
| :--- | :--- | :--- |
| **`ADMIN`** | Full System Command | User directory management, property approvals/rejections, contracts ledger, payment confirmations, and system analytics. |
| **`LANDLORD`** | Property & Tenancy Manager | Create/edit properties, room inventory management, review rental applications, issue binding digital contracts, confirm payments, and dispatch maintenance technicians. |
| **`TENANT`** | Renter & Home Seeker | Search/filter properties, select available rooms, send rental requests, e-sign contracts, mock digital payment settlement (ABA/Card), download receipts, and create maintenance tickets. |

---

## 🔑 Demo Seed Accounts

| Role | Email | Password |
| :--- | :--- | :--- |
| 👑 **ADMIN** | `admin@renteasy.com` | `Admin123!` |
| 🟣 **LANDLORD** | `landlord@renteasy.com` | `Landlord123!` |
| 🟢 **TENANT 1** | `tenant@renteasy.com` | `Tenant123!` |
| 🟢 **TENANT 2** | `pinky@renteasy.com` | `password123` |

---

## 🛠️ Quick Start Guide

### 1. Start the Backend Server (Express + MongoDB)
```bash
cd backend
npm install
npm run dev
```
- Backend URL: **`http://localhost:5001`**
- API Health Check: **`http://localhost:5001/api/health`**
- Database Seed: `npm run seed`

### 2. Start the Frontend Application (Angular)
```bash
cd frontend
npm install
npm start
```
- Frontend URL: **`http://localhost:4200`**

---

## 📦 10 Mongoose Database Models

1. **`User`**: Full authentication model (`ADMIN`, `LANDLORD`, `TENANT`), bcrypt password hashing, JWT token generator, profile data, credit scores.
2. **`Property`**: Rental properties catalog with status (`PENDING`, `APPROVED`, `REJECTED`, `INACTIVE`), types (`APARTMENT`, `HOUSE`, `CONDO`, `VILLA`, `ROOM`, `SHOP`), geolocation, and amenities.
3. **`PropertyImage`**: Associated multi-image gallery with cover flag.
4. **`Room`**: Individual room units with numbers, floor, pricing, deposit, and status (`AVAILABLE`, `RESERVED`, `RENTED`, `MAINTENANCE`).
5. **`RoomImage`**: Room unit photo attachments.
6. **`RentalRequest`**: Tenant rental application dossiers with status (`PENDING`, `ACCEPTED`, `REJECTED`, `CANCELLED`).
7. **`RentalContract`**: Binding digital tenancy agreements with monthly rent, deposit escrow, and contract terms.
8. **`Payment`**: Digital rent payments with mock ABA/Card settlement, status (`PENDING`, `PAID`, `REJECTED`), and auto-generated receipt numbers (`REC-XXXX`).
9. **`MaintenanceRequest`**: Repair tickets with priority levels (`LOW`, `MEDIUM`, `HIGH`, `EMERGENCY`), technician assignments, and status tracking.
10. **`Notification`**: Real-time user alert inbox and unread counters.

---

## 📡 REST API Reference

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register account with role
- `POST /api/auth/login` — Sign in and receive JWT token
- `POST /api/auth/logout` — Revoke session
- `POST /api/auth/forgot-password` — Password reset request
- `POST /api/auth/reset-password` — Reset password with token
- `GET  /api/auth/me` — Current user profile *(Protected)*
- `POST /api/auth/change-password` — Update account password *(Protected)*

### Properties (`/api/properties`)
- `GET    /api/properties` — Search, filter (city, type, price, status), sort, and paginate
- `GET    /api/properties/:id` — Property details with room inventory
- `POST   /api/properties` — Create new property *(Landlord / Admin)*
- `PUT    /api/properties/:id` — Update property *(Landlord / Admin)*
- `DELETE /api/properties/:id` — Delete property *(Landlord / Admin)*
- `PUT    /api/properties/:id/approve` — Approve listing *(Admin)*
- `PUT    /api/properties/:id/reject` — Reject listing *(Admin)*

### Rooms (`/api/rooms`)
- `GET    /api/rooms` — Filter by property and availability
- `POST   /api/rooms` — Add room unit
- `PUT    /api/rooms/:id` — Edit room pricing and details
- `DELETE /api/rooms/:id` — Delete room
- `PATCH  /api/rooms/:id/status` — Update availability (`AVAILABLE`, `RESERVED`, `RENTED`, `MAINTENANCE`)

### Rental Requests & Contracts (`/api/rental-requests`, `/api/contracts`)
- `GET /api/rental-requests` — List user-specific rental applications
- `POST /api/rental-requests` — Submit application for unit
- `PUT /api/rental-requests/:id/accept` — Accept request & auto-generate `RentalContract`
- `PUT /api/rental-requests/:id/reject` — Decline application
- `GET /api/contracts` — View active lease agreements
- `PUT /api/contracts/:id/terminate` — Terminate contract

### Payments & Maintenance (`/api/payments`, `/api/maintenance`)
- `GET  /api/payments` — View rent payment ledger
- `POST /api/payments` — Submit mock payment (ABA KHQR / Card)
- `PUT  /api/payments/:id/confirm` — Confirm payment and issue receipt
- `GET  /api/maintenance` — Track maintenance tickets
- `POST /api/maintenance` — Submit maintenance request
- `PUT  /api/maintenance/:id/status` — Update repair ticket & landlord response

### Admin & System (`/api/admin`, `/api/seed`)
- `GET  /api/admin/dashboard` — System statistics (Users, Properties, Occupancy, Revenue)
- `GET  /api/admin/reports` — Financial and tenancy reports
- `POST /api/seed` — Seed MongoDB database with demo multi-role data
