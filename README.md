# Prescripto (Unicare) — Doctor Appointment Booking Platform

Full-stack appointment booking system with **three portals** (Patient, Admin, Doctor) and a guided **health-assistant chatbot (UniBot)**.

- **Patient app**: `frontend/` (React + Vite + Tailwind)
- **Admin/Doctor panel**: `admin/` (React + Vite + Tailwind)
- **API server**: `backend/` (Node.js + Express + MongoDB)

If you want the detailed end-to-end flow (screens, API endpoints, DB schema), see `USER_FLOW.md`.

## What this project is trying to achieve

- Make it easy for patients to **discover doctors**, **book time slots**, and **manage appointments**.
- Give admins a single place to **onboard doctors**, **monitor activity**, and **manage appointments**.
- Give doctors tools to **manage their schedule/appointments**, mark visits complete, and update profile/availability.
- Add a lightweight assistant (**UniBot**) that can:
  - provide **safe, non-diagnostic** guidance and red-flag detection
  - help users **find a relevant speciality**
  - fetch **doctors** / **slots** and (if logged in) show **recent appointments**

## ✨ Key features

### Portals & auth

- **Patient portal (`frontend/`)**
  - register/login
  - browse doctors + filter by speciality
  - book appointments using available slots
  - profile editing (image, gender, DOB, address, etc.)
  - appointment list (cancel / history)

- **Admin + Doctor portal (`admin/`)**
  - single app with two roles (token-based: `aToken` for Admin, `dToken` for Doctor)
  - Admin: add doctors, list doctors, see dashboard analytics, manage appointments
  - Doctor: view own appointments, complete/cancel, edit profile, toggle availability

### Payments

- Stripe integration is present.
- Razorpay dependency exists (code may be present but can be toggled depending on env/config).

### UniBot chatbot (recent addition)

- Frontend component: `frontend/src/components/Chatbot.jsx`
- Backend endpoint: `POST /api/chat` (`backend/routes/chatRoute.js` → `backend/controllers/chatController.js`)

UniBot supports both **guided** (button/menu) and **free-text** flows:

- **Symptom check** (non-diagnostic): returns general safety tips + optional follow-up question(s)
- **Urgency detection**: detects emergency keywords and escalates advice
- **Find a specialist**: maps symptoms/keywords to specialities and returns matching doctors
- **Booking helper**: returns doctors and checks slots for the first matching doctor (by date)
- **View my appointments**: if the user is logged in and provides `userId`, returns recent appointments

> Safety note: the chatbot intentionally adds a “consult a qualified doctor” style suffix to responses.

## 🧱 Tech stack

- **Frontend/Admin**: React 18, Vite 5, Tailwind CSS, React Router, Axios, React Toastify
- **Backend**: Node.js, Express, Mongoose
- **DB**: MongoDB
- **Auth**: JWT + bcrypt
- **Uploads**: Multer
- **Images**: Cloudinary
- **Payments**: Stripe (+ Razorpay dependency)
- **Deployment**: Vercel configs exist for `frontend/`, `admin/`, and `backend/`

## 📁 Repo structure

```text
.
├─ backend/    # Express API + MongoDB (port 4000 by default)
├─ frontend/   # Patient-facing React app
├─ admin/      # Admin + Doctor panel React app
├─ USER_FLOW.md
└─ README.md
```

## 🔐 Environment variables

### Backend (`backend/.env`)

```env
MONGODB_URI=mongodb+srv://...
CLOUDINARY_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_SECRET_KEY=...
JWT_SECRET=...
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=...
CURRENCY=INR
PORT=4000

# Optional payments
# STRIPE_SECRET_KEY=sk_...
# RAZORPAY_KEY_ID=rzp_...
# RAZORPAY_KEY_SECRET=...
```

### Patient frontend (`frontend/.env`)

```env
VITE_BACKEND_URL=http://localhost:4000
```

### Admin panel (`admin/.env`)

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_CURRENCY=₹
```

## ▶️ Run locally (Windows / PowerShell friendly)

Install and run each app in its own terminal.

### 1) Backend API

```powershell
cd backend
npm install
npm run server
```

The API starts on `http://localhost:4000`.

### 2) Patient frontend

```powershell
cd frontend
npm install
npm run dev
```

### 3) Admin / Doctor panel

```powershell
cd admin
npm install
npm run dev
```

## 🔌 Chat API contract (UniBot)

**Endpoint**: `POST /api/chat`

**Body**:

```json
{
  "message": "I have fever and cough",
  "userId": "<optional-user-id>"
}
```

**Response (shape)**:

- `intent`: `urgency | view_appointments | booking | symptom_check | faq`
- `speciality`: inferred speciality, if any
- `doctor_cards`: simplified doctor list for UI cards
- `appointment_cards`: simplified appointment list (when logged in)
- `slots`: slot list (booking helper)

## 🧪 Seed data

There’s a `backend/seed.js` included for populating the database (see the file for details).

## 📌 Notes / known constraints

- Chatbot responses are **guidance only** and do **not** diagnose.
- Availability/slot behavior depends on what’s stored in `slotModel` for the computed date key (`d_m_yyyy`).

## 📚 Documentation

- `USER_FLOW.md` contains the full user journey, DB schema notes, and an endpoint reference.

