# 📋 Doctor Appointment Booking System — Complete User Flow & Project Documentation

## Table of Contents

- [Project Overview](#project-overview)
- [Architecture & Tech Stack](#architecture--tech-stack)
- [Three Portals](#three-portals)
- [Database Schema — What Gets Saved](#database-schema--what-gets-saved)
- [Environment Variables](#environment-variables)
- [How to Run the Project](#how-to-run-the-project)
- [Portal 1: Patient / User Frontend](#portal-1-patient--user-frontend)
  - [User Registration Flow](#1-user-registration-flow)
  - [User Login Flow](#2-user-login-flow)
  - [Browsing Doctors](#3-browsing-doctors)
  - [Booking an Appointment](#4-booking-an-appointment)
  - [Viewing My Appointments](#5-viewing-my-appointments)
  - [Cancelling an Appointment](#6-cancelling-an-appointment)
  - [Online Payment (Stripe / Razorpay)](#7-online-payment-stripe--razorpay)
  - [Editing User Profile](#8-editing-user-profile)
  - [Static Pages](#9-static-pages-about--contact)
- [Portal 2: Admin Panel](#portal-2-admin-panel)
  - [Admin Login Flow](#1-admin-login-flow)
  - [Admin Dashboard](#2-admin-dashboard)
  - [Add Doctor](#3-add-doctor)
  - [View All Doctors](#4-view-all-doctors--toggle-availability)
  - [View All Appointments](#5-view-all-appointments)
  - [Cancel Any Appointment](#6-cancel-any-appointment)
- [Portal 3: Doctor Panel](#portal-3-doctor-panel)
  - [Doctor Login Flow](#1-doctor-login-flow)
  - [Doctor Dashboard](#2-doctor-dashboard)
  - [Doctor Appointments](#3-doctor-appointments)
  - [Complete / Cancel Appointments](#4-complete--cancel-appointments)
  - [Doctor Profile Management](#5-doctor-profile-management)
- [Authentication & Middleware](#authentication--middleware)
- [What Gets Saved in the Database vs What Does Not](#what-gets-saved-in-the-database-vs-what-does-not)
- [API Endpoints Reference](#api-endpoints-reference)
- [File & Folder Structure](#file--folder-structure)

---

## Project Overview

This is a **full-stack Doctor Appointment Booking System** with **three separate portals**:

1. **Patient Frontend** (`frontend/`) — Where patients register, browse doctors, book appointments, pay online, and manage their profile.
2. **Admin Panel** (`admin/`) — Where the system administrator adds doctors, views all appointments, cancels appointments, and sees dashboard analytics.
3. **Doctor Panel** (`admin/` — Doctor login) — Where doctors view their appointments, mark them as complete, cancel them, update their profile, and see their earnings dashboard.

The Admin and Doctor portals share the **same React app** (`admin/`). They toggle between Admin and Doctor views based on which login token is present (`aToken` for admin, `dToken` for doctor).

---

## Architecture & Tech Stack

| Layer        | Technology                                                                 |
| ------------ | -------------------------------------------------------------------------- |
| **Frontend** | React 18, Vite, Tailwind CSS, React Router, Axios, React Toastify         |
| **Admin**    | React 18, Vite, Tailwind CSS, React Router, Axios, React Toastify         |
| **Backend**  | Node.js, Express.js                                                        |
| **Database** | MongoDB (via Mongoose)                                                     |
| **Auth**     | JSON Web Tokens (JWT), bcrypt for password hashing                         |
| **Storage**  | Cloudinary (doctor profile images, user profile images)                    |
| **Payments** | Stripe (active), Razorpay (code present but commented out)                 |
| **Upload**   | Multer (multipart form data handling for image uploads)                    |
| **Validation** | validator.js (email validation)                                          |
| **Deployment** | Vercel (all three parts have `vercel.json`)                              |

---

## Three Portals

```
┌──────────────────────┐    ┌──────────────────────┐    ┌──────────────────────┐
│   PATIENT FRONTEND   │    │     ADMIN PANEL       │    │    DOCTOR PANEL      │
│   (frontend/)        │    │     (admin/)          │    │    (admin/)          │
│                      │    │                       │    │                      │
│  - Register/Login    │    │  - Admin Login        │    │  - Doctor Login      │
│  - Browse Doctors    │    │  - Dashboard          │    │  - Dashboard         │
│  - Book Appointments │    │  - Add Doctor         │    │  - My Appointments   │
│  - Pay Online        │    │  - All Doctors List   │    │  - Complete/Cancel   │
│  - My Appointments   │    │  - All Appointments   │    │  - Edit Profile      │
│  - My Profile        │    │  - Cancel Appointments│    │  - Toggle Available  │
│  - About / Contact   │    │  - Toggle Dr Avail.   │    │                      │
└──────────┬───────────┘    └──────────┬────────────┘    └──────────┬───────────┘
           │                           │                            │
           └───────────────────────────┼────────────────────────────┘
                                       │
                              ┌────────▼────────┐
                              │   BACKEND API   │
                              │   (backend/)    │
                              │  Express.js     │
                              │  Port 4000      │
                              └────────┬────────┘
                                       │
                    ┌──────────────────┬┴──────────────────┐
                    │                  │                    │
              ┌─────▼─────┐    ┌──────▼──────┐    ┌───────▼───────┐
              │  MongoDB   │    │ Cloudinary  │    │ Stripe/Razorpay│
              │ (Database) │    │  (Images)   │    │  (Payments)    │
              └────────────┘    └─────────────┘    └───────────────┘
```

---

## Database Schema — What Gets Saved

### 1. `users` Collection

| Field      | Type     | Default                          | Required | Notes                                        |
| ---------- | -------- | -------------------------------- | -------- | -------------------------------------------- |
| `name`     | String   | —                                | ✅       | Set at registration                           |
| `email`    | String   | —                                | ✅       | Unique, set at registration                   |
| `password` | String   | —                                | ✅       | Hashed with bcrypt (10 salt rounds)           |
| `image`    | String   | base64 default avatar PNG        | ❌       | Updated via Cloudinary upload                 |
| `phone`    | String   | `'000000000'`                    | ❌       | Updated from profile page                     |
| `address`  | Object   | `{ line1: '', line2: '' }`       | ❌       | Updated from profile page                     |
| `gender`   | String   | `'Not Selected'`                 | ❌       | Updated from profile page                     |
| `dob`      | String   | `'Not Selected'`                 | ❌       | Updated from profile page                     |

### 2. `doctors` Collection

| Field          | Type    | Default | Required | Notes                                           |
| -------------- | ------- | ------- | -------- | ----------------------------------------------- |
| `name`         | String  | —       | ✅       | Set by admin when adding doctor                  |
| `email`        | String  | —       | ✅       | Unique, set by admin                             |
| `password`     | String  | —       | ✅       | Hashed with bcrypt, set by admin                 |
| `image`        | String  | —       | ✅       | Uploaded to Cloudinary by admin                  |
| `speciality`   | String  | —       | ✅       | One of 6 specialities                            |
| `degree`       | String  | —       | ✅       | e.g., "MBBS"                                     |
| `experience`   | String  | —       | ✅       | e.g., "5 Years"                                  |
| `about`        | String  | —       | ✅       | Doctor bio text                                  |
| `available`    | Boolean | `true`  | ❌       | Toggled by admin or doctor                       |
| `fees`         | Number  | —       | ✅       | Appointment fee amount                           |
| `slots_booked` | Object  | `{}`    | ❌       | `{ "15_3_2026": ["10:00 AM", "11:30 AM"], ... }` |
| `address`      | Object  | —       | ✅       | `{ line1: '...', line2: '...' }`                 |
| `date`         | Number  | —       | ✅       | Timestamp when doctor was added                  |

### 3. `appointments` Collection

| Field         | Type    | Default | Required | Notes                                             |
| ------------- | ------- | ------- | -------- | ------------------------------------------------- |
| `userId`      | String  | —       | ✅       | References the patient who booked                  |
| `docId`       | String  | —       | ✅       | References the doctor                              |
| `slotDate`    | String  | —       | ✅       | Format: `"15_3_2026"` (day_month_year)             |
| `slotTime`    | String  | —       | ✅       | Format: `"10:00 AM"`                               |
| `userData`    | Object  | —       | ✅       | **Snapshot** of user data at time of booking       |
| `docData`     | Object  | —       | ✅       | **Snapshot** of doctor data at time of booking     |
| `amount`      | Number  | —       | ✅       | The doctor's fee at time of booking                |
| `date`        | Number  | —       | ✅       | Timestamp of when appointment was created          |
| `cancelled`   | Boolean | `false` | ❌       | Set to `true` when cancelled by user/doctor/admin  |
| `payment`     | Boolean | `false` | ❌       | Set to `true` when online payment is verified      |
| `isCompleted` | Boolean | `false` | ❌       | Set to `true` when doctor marks it complete        |

> **Important**: `userData` and `docData` are **snapshots** — full copies of the user/doctor document embedded into the appointment at booking time. This means even if a user or doctor later changes their profile, the appointment record preserves the original data.

---

## Environment Variables

### Backend (`backend/.env`)

```env
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>
CLOUDINARY_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_SECRET_KEY=your_secret_key
JWT_SECRET=your_jwt_secret
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
CURRENCY=INR
PORT=4000
# STRIPE_SECRET_KEY=sk_...        (uncomment to enable Stripe)
# RAZORPAY_KEY_ID=rzp_...         (uncomment to enable Razorpay)
# RAZORPAY_KEY_SECRET=...         (uncomment to enable Razorpay)
```

### Frontend (`frontend/.env`)

```env
VITE_BACKEND_URL=http://localhost:4000
```

### Admin (`admin/.env`)

```env
VITE_BACKEND_URL=http://localhost:4000
VITE_CURRENCY=₹
```

---

## How to Run the Project

### Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account
- (Optional) Stripe account for payments

### 1. Start the Backend

```bash
cd backend
npm install
# Create .env file with the variables listed above
npm run server    # Uses nodemon for hot reload
# OR
npm start         # Standard node
```

The backend starts on `http://localhost:4000`.

### 2. Start the Patient Frontend

```bash
cd frontend
npm install
# Create .env file: VITE_BACKEND_URL=http://localhost:4000
npm run dev
```

Opens on `http://localhost:5173` (default Vite port).

### 3. Start the Admin/Doctor Panel

```bash
cd admin
npm install
# Create .env file: VITE_BACKEND_URL=http://localhost:4000 and VITE_CURRENCY=₹
npm run dev
```

Opens on `http://localhost:5174` (or next available Vite port).

---

## Portal 1: Patient / User Frontend

**URL**: `http://localhost:5173`

### 1. User Registration Flow

**Page**: `/login` (state toggled to "Sign Up")

**Steps**:
1. User navigates to `/login`.
2. The page shows "Create Account" form by default (state = `'Sign Up'`).
3. User enters **Full Name**, **Email**, and **Password**.
4. User clicks **"Create account"** button.
5. Frontend sends `POST /api/user/register` with `{ name, email, password }`.

**Backend Processing**:
1. Validates all fields are present → error if missing.
2. Validates email format using `validator.isEmail()` → error if invalid.
3. Validates password length ≥ 8 characters → error if too short.
4. Hashes password with `bcrypt` (10 salt rounds).
5. Creates new user document in MongoDB with **only** `name`, `email`, `password`.
6. All other fields (`image`, `phone`, `address`, `gender`, `dob`) get their **default values**.
7. Generates a JWT token with `{ id: user._id }`.
8. Returns `{ success: true, token }`.

**Frontend After Success**:
1. Stores `token` in `localStorage`.
2. Sets `token` in React state (via `AppContext`).
3. `useEffect` detects token change → navigates to `/` (home page).
4. `AppContext` `useEffect` detects token → calls `loadUserProfileData()` to fetch full user profile.

**What gets saved in DB**: A new document in `users` collection with name, email, hashed password, and all defaults.

**What does NOT get saved**: The raw/plain-text password is never stored. The JWT token is not stored server-side.

---

### 2. User Login Flow

**Page**: `/login` (state toggled to "Login")

**Steps**:
1. User clicks "Login here" to toggle to login mode.
2. User enters **Email** and **Password**.
3. User clicks **"Login"** button.
4. Frontend sends `POST /api/user/login` with `{ email, password }`.

**Backend Processing**:
1. Finds user by email in DB → error if not found (`"User does not exist"`).
2. Compares entered password with stored hash using `bcrypt.compare()`.
3. If match → generates JWT token, returns `{ success: true, token }`.
4. If no match → returns `{ success: false, message: "Invalid credentials" }`.

**What does NOT get saved**: Nothing new is written to the DB during login. Token is stateless (JWT).

---

### 3. Browsing Doctors

**Pages**: `/` (Home), `/doctors`, `/doctors/:speciality`

**Home Page** (`/`):
- Displays **Header** banner (hero section).
- **Speciality Menu**: 6 clickable speciality icons (General physician, Gynecologist, Dermatologist, Pediatricians, Neurologist, Gastroenterologist). Clicking navigates to `/doctors/<speciality>`.
- **Top Doctors**: Shows a subset of doctors from the global doctors list. Clicking a doctor card navigates to `/appointment/<docId>`.
- **Banner**: CTA to create an account or book an appointment.

**All Doctors Page** (`/doctors`):
- Fetches doctor list from `GET /api/doctor/list` (called once on app mount via `AppContext.getDoctosData()`).
- Left sidebar shows speciality **filters** (General physician, Gynecologist, etc.).
- Clicking a filter navigates to `/doctors/<speciality>` and filters the list client-side.
- Each doctor card shows: **image**, **availability status** (green/gray dot), **name**, **speciality**.
- Clicking a doctor card navigates to `/appointment/<docId>`.

**What does NOT get saved**: Doctor browsing and filtering is purely client-side. No data is written to the DB. The doctor list is fetched publicly (no auth needed) with passwords and emails excluded from the response.

---

### 4. Booking an Appointment

**Page**: `/appointment/:docId`

**Steps**:
1. User clicks on a doctor card → navigates to `/appointment/<docId>`.
2. Page displays the doctor's full info: **image, name, degree, speciality, experience, about, fees**.
3. Below, a **date picker** shows the next 7 days as clickable day bubbles (SUN, MON, ... with date).
4. Below the date picker, **30-minute time slots** are shown for the selected day (10:00 AM → 9:00 PM).
5. Slots that are already booked (from `docInfo.slots_booked`) are **excluded** from display.
6. If today, slots before the current hour are also excluded.
7. User selects a day, then selects a time slot (highlighted in blue/primary).
8. User clicks **"Book an appointment"**.

**If Not Logged In**:
- Toast warning: `'Login to book appointment'`.
- Redirected to `/login`.

**If Logged In — Frontend sends**:
- `POST /api/user/book-appointment` with `{ docId, slotDate, slotTime }` + `token` header.

**Backend Processing**:
1. `authUser` middleware decodes JWT → injects `userId` into `req.body`.
2. Fetches full doctor data (excluding password).
3. Checks `docData.available` → error if doctor not available.
4. Checks `slots_booked[slotDate]` → error if that specific time slot is already taken.
5. Adds the `slotTime` to `slots_booked[slotDate]` array.
6. Fetches full user data (excluding password).
7. Creates a new appointment document with:
   - `userId`, `docId`
   - `userData` (full snapshot), `docData` (full snapshot)
   - `amount` = doctor's fees
   - `slotTime`, `slotDate` (format: `"15_3_2026"`)
   - `date` = `Date.now()` timestamp
8. Saves appointment to `appointments` collection.
9. Updates doctor's `slots_booked` in `doctors` collection.
10. Returns `{ success: true, message: 'Appointment Booked' }`.

**Frontend After Success**:
- Toast success message.
- Refreshes doctors data (to update slot availability globally).
- Navigates to `/my-appointments`.

**What gets saved in DB**:
- New document in `appointments` collection.
- Updated `slots_booked` on the doctor's document.

**Related Doctors**: Below the booking section, a `RelatedDoctors` component shows other doctors with the same speciality (excluding the current one).

---

### 5. Viewing My Appointments

**Page**: `/my-appointments`

**Steps**:
1. User navigates to `/my-appointments` (must be logged in).
2. Frontend sends `GET /api/user/appointments` with `token` header.
3. Backend fetches all appointments where `userId` matches the logged-in user.
4. Returns the full list (including embedded `docData` and `userData` snapshots).

**Display for each appointment**:
- Doctor image, name, speciality.
- Doctor address (line1, line2).
- Date & time (formatted from `slotDate` + `slotTime`).
- Action buttons based on appointment state:
  - **Active (not cancelled, not paid, not completed)**: "Pay Online" button + "Cancel appointment" button.
  - **After clicking "Pay Online"**: Shows Stripe and Razorpay logo buttons.
  - **Paid**: "Paid" badge (blue background).
  - **Completed**: "Completed" badge (green border).
  - **Cancelled**: "Appointment cancelled" badge (red border).

**What does NOT get saved**: Viewing appointments is a read-only operation.

---

### 6. Cancelling an Appointment

**Page**: `/my-appointments`

**Steps**:
1. User clicks **"Cancel appointment"** on an active appointment.
2. Frontend sends `POST /api/user/cancel-appointment` with `{ appointmentId }` + `token` header.

**Backend Processing**:
1. Finds the appointment by ID.
2. Verifies `appointmentData.userId === userId` (the logged-in user owns this appointment) → error if unauthorized.
3. Sets `cancelled: true` on the appointment document.
4. **Releases the time slot**: Removes the `slotTime` from the doctor's `slots_booked[slotDate]` array.
5. Returns success.

**What gets saved in DB**:
- `appointments` document: `cancelled` → `true`.
- `doctors` document: `slots_booked` updated (slot freed up).

---

### 7. Online Payment (Stripe / Razorpay)

#### Stripe Flow (Active)

1. User clicks **"Pay Online"** → then clicks the **Stripe logo** button.
2. Frontend sends `POST /api/user/payment-stripe` with `{ appointmentId }` + `token` header.
3. Backend creates a Stripe Checkout Session with:
   - `success_url` → `frontend/verify?success=true&appointmentId=<id>`
   - `cancel_url` → `frontend/verify?success=false&appointmentId=<id>`
   - Line item: "Appointment Fees" at the doctor's fee amount.
4. Returns `{ session_url }` → frontend redirects user to Stripe's hosted checkout page.
5. After payment, Stripe redirects to `/verify?success=true&appointmentId=<id>`.
6. The `Verify` page (`/verify`) sends `POST /api/user/verifyStripe` with `{ success, appointmentId }`.
7. If `success === "true"` → backend sets `payment: true` on the appointment.
8. User is redirected to `/my-appointments`.

#### Razorpay Flow (Commented Out)

The Razorpay integration code exists but is **commented out** in both backend routes and controllers. It uses Razorpay's client-side SDK to open a payment modal, then verifies the order server-side.

**What gets saved in DB**: `appointments` document: `payment` → `true`.

---

### 8. Editing User Profile

**Page**: `/my-profile`

**Steps**:
1. User navigates to `/my-profile`.
2. Profile data is loaded from `AppContext.userData` (fetched via `GET /api/user/get-profile`).
3. Displays: **profile image, name, email (read-only), phone, address, gender, dob**.
4. User clicks **"Edit"** → fields become editable.
5. User can change: **name, phone, address (line1 + line2), gender, dob, profile image**.
6. User clicks **"Save information"**.
7. Frontend sends `POST /api/user/update-profile` as **multipart form data** with:
   - `name`, `phone`, `address` (JSON stringified), `gender`, `dob`, and optionally `image` file.

**Backend Processing**:
1. Validates required fields → error if missing.
2. Updates user document with `name`, `phone`, `address` (parsed from JSON), `dob`, `gender`.
3. If image file provided → uploads to **Cloudinary** → gets secure URL → updates `image` field.
4. Returns success.

**What gets saved in DB**: Updated fields on the `users` document. Image URL (Cloudinary) replaces the old one.

**What does NOT get saved**: Email cannot be changed. The old profile image on Cloudinary is **not** deleted (it remains orphaned).

---

### 9. Static Pages (About & Contact)

**Pages**: `/about`, `/contact`

These are **purely static** informational pages with no backend interaction. Nothing is saved.

---

## Portal 2: Admin Panel

**URL**: `http://localhost:5174` (same app as Doctor panel)

The admin panel and doctor panel share the **same React app** (`admin/`). The `App.jsx` checks:
- If `aToken` exists → shows Admin routes (Dashboard, All Appointments, Add Doctor, Doctors List).
- If `dToken` exists → shows Doctor routes (Dashboard, Appointments, Profile).
- If neither → shows the Login page.

### 1. Admin Login Flow

**Page**: Login page (state = "Admin")

**Steps**:
1. Admin enters **email** and **password**.
2. Frontend sends `POST /api/admin/login` with `{ email, password }`.

**Backend Processing**:
1. Compares entered email/password with `process.env.ADMIN_EMAIL` and `process.env.ADMIN_PASSWORD` (plain-text comparison from env vars).
2. If match → generates JWT by signing `email + password` concatenation with JWT_SECRET.
3. Returns `{ success: true, token }`.

**Frontend After Success**:
1. Stores `aToken` in `localStorage`.
2. Sets `aToken` in `AdminContext` state.
3. `App.jsx` detects `aToken` → renders sidebar + admin routes.

**What does NOT get saved**: Admin is **not** a database entity. There is no admin document in MongoDB. Admin credentials are purely from environment variables. The admin token is not stored server-side.

---

### 2. Admin Dashboard

**Page**: `/admin-dashboard`

- Sends `GET /api/admin/dashboard` with `aToken` header.
- Backend fetches counts of **all doctors**, **all users**, and **all appointments**.
- Returns: `{ doctors: count, patients: count, appointments: count, latestAppointments: [...] }`.
- Dashboard shows 3 stat cards: **Doctors count**, **Appointments count**, **Patients count**.
- Below, shows the **latest 5 bookings** with doctor image, name, date, and a cancel button (or Cancelled/Completed status).

**What does NOT get saved**: Read-only dashboard. No writes.

---

### 3. Add Doctor

**Page**: `/add-doctor`

**Steps**:
1. Admin fills in the form: **image, name, email, password, experience, fees, speciality, degree, address (line1 + line2), about**.
2. Admin clicks **"Add doctor"**.
3. Frontend sends `POST /api/admin/add-doctor` as **multipart form data** with `aToken` header.

**Backend Processing**:
1. `authAdmin` middleware verifies the admin token.
2. Validates all required fields → error if missing.
3. Validates email format → error if invalid.
4. Validates password ≥ 8 chars → error if too short.
5. Hashes password with bcrypt.
6. Uploads image to **Cloudinary** → gets secure URL.
7. Creates doctor document with all fields + `date: Date.now()`.
8. Saves to `doctors` collection.
9. Returns success.

**What gets saved in DB**: New document in `doctors` collection. Image stored on Cloudinary.

**Important**: Doctors are **only** created by the admin. There is no doctor self-registration. The admin sets the doctor's login credentials (email + password).

---

### 4. View All Doctors & Toggle Availability

**Page**: `/doctor-list`

- Sends `GET /api/admin/all-doctors` with `aToken` header.
- Displays all doctors in a grid: **image, name, speciality, availability checkbox**.
- Admin can **toggle the availability checkbox** on any doctor.
- Toggling sends `POST /api/admin/change-availability` with `{ docId }` + `aToken` header.
- Backend flips the doctor's `available` boolean.

**What gets saved in DB**: `doctors` document: `available` field toggled.

---

### 5. View All Appointments

**Page**: `/all-appointments`

- Sends `GET /api/admin/appointments` with `aToken` header.
- Backend returns **every appointment in the system** (all users, all doctors).
- Displayed in a table: **#, Patient (image + name), Age, Date & Time, Doctor (image + name), Fees, Action**.
- Age is calculated client-side from `userData.dob`.

---

### 6. Cancel Any Appointment

**Page**: `/all-appointments` or `/admin-dashboard`

- Admin clicks the ❌ cancel icon on any appointment.
- Sends `POST /api/admin/cancel-appointment` with `{ appointmentId }` + `aToken` header.
- Backend sets `cancelled: true` on the appointment.

**⚠️ Note**: Unlike user cancellation, admin cancellation does **NOT** release the doctor's time slot from `slots_booked`. This appears to be a bug/oversight — the slot remains blocked even after admin cancellation.

**What gets saved in DB**: `appointments` document: `cancelled` → `true`.

---

## Portal 3: Doctor Panel

**URL**: `http://localhost:5174` (same app as Admin panel, different login)

### 1. Doctor Login Flow

**Page**: Login page (state = "Doctor")

**Steps**:
1. On the shared login page, click **"Doctor Login? Click here"** to switch to Doctor mode.
2. Doctor enters **email** and **password** (credentials set by admin when the doctor was added).
3. Frontend sends `POST /api/doctor/login` with `{ email, password }`.

**Backend Processing**:
1. Finds doctor by email in `doctors` collection → error if not found.
2. Compares password with stored hash using `bcrypt.compare()`.
3. If match → generates JWT with `{ id: doctor._id }`.
4. Returns `{ success: true, token }`.

**Frontend After Success**:
1. Stores `dToken` in `localStorage`.
2. Sets `dToken` in `DoctorContext` state.
3. `App.jsx` detects `dToken` → renders sidebar + doctor routes.

---

### 2. Doctor Dashboard

**Page**: `/doctor-dashboard`

- Sends `GET /api/doctor/dashboard` with `dToken` header.
- Backend filters appointments where `docId` matches the logged-in doctor.
- Calculates:
  - **Earnings**: Sum of `amount` for appointments where `isCompleted === true` OR `payment === true`.
  - **Total Appointments**: Count of all doctor's appointments.
  - **Unique Patients**: Count of unique `userId` values across appointments.
  - **Latest Appointments**: Reversed list (most recent first).
- Dashboard shows 3 stat cards: **Earnings**, **Appointments count**, **Patients count**.
- Below, shows the **latest 5 bookings** with patient image, name, date, and Complete ✅ / Cancel ❌ buttons.

**What does NOT get saved**: Read-only dashboard. No writes (unless doctor clicks complete/cancel).

---

### 3. Doctor Appointments

**Page**: `/doctor-appointments`

- Sends `GET /api/doctor/appointments` with `dToken` header.
- Returns only appointments for this specific doctor.
- Displayed in a table: **#, Patient (image + name), Payment method (Online/CASH), Age, Date & Time, Fees, Action**.
- Payment column shows "Online" if `payment: true`, otherwise "CASH".

---

### 4. Complete / Cancel Appointments

**Pages**: `/doctor-appointments` or `/doctor-dashboard`

**Complete an Appointment**:
1. Doctor clicks the ✅ tick icon.
2. Sends `POST /api/doctor/complete-appointment` with `{ appointmentId }` + `dToken` header.
3. Backend verifies `appointmentData.docId === docId` (doctor owns this appointment).
4. Sets `isCompleted: true`.

**Cancel an Appointment**:
1. Doctor clicks the ❌ cancel icon.
2. Sends `POST /api/doctor/cancel-appointment` with `{ appointmentId }` + `dToken` header.
3. Backend verifies `appointmentData.docId === docId`.
4. Sets `cancelled: true`.

**⚠️ Note**: Like admin cancellation, doctor cancellation also does **NOT** release the time slot from `slots_booked`. Only user-initiated cancellation releases slots.

**What gets saved in DB**: `appointments` document: `isCompleted` → `true` or `cancelled` → `true`.

---

### 5. Doctor Profile Management

**Page**: `/doctor-profile`

- Sends `GET /api/doctor/profile` with `dToken` header.
- Displays: **image, name, degree, speciality, experience, about, fees, address, availability checkbox**.
- Doctor clicks **"Edit"** → about, fees, address, and availability become editable.
- Doctor clicks **"Save"** → sends `POST /api/doctor/update-profile` with `{ fees, address, available }` + `dToken` header.

**What the doctor CAN edit**: `fees`, `address` (line1 + line2), `about`, `available`.

**What the doctor CANNOT edit**: `name`, `email`, `password`, `image`, `degree`, `speciality`, `experience`. These are set by the admin and are immutable from the doctor panel.

**What gets saved in DB**: Updated `fees`, `address`, `available` on the `doctors` document.

---

## Authentication & Middleware

### Three Auth Middlewares

| Middleware   | Header Key | Token Content           | Injects          | Used By                  |
| ------------ | ---------- | ----------------------- | ---------------- | ------------------------ |
| `authUser`   | `token`    | `{ id: user._id }`     | `req.body.userId`| All `/api/user/*` routes  |
| `authDoctor` | `dtoken`   | `{ id: doctor._id }`   | `req.body.docId` | All `/api/doctor/*` routes|
| `authAdmin`  | `atoken`   | `email + password` str  | nothing          | All `/api/admin/*` routes |

### How Auth Works

1. **User/Doctor**: JWT payload contains `{ id }`. Middleware decodes it and injects the ID into `req.body` so controllers can use it.
2. **Admin**: JWT payload is `email + password` concatenated string. Middleware verifies it matches the env vars. Admin has no DB record.
3. All three tokens are stored in `localStorage` on the client and sent as **custom headers** (not cookies, not Bearer auth).

---

## What Gets Saved in the Database vs What Does Not

### ✅ Saved in MongoDB

| Action                      | Collection      | What Changes                                                |
| --------------------------- | --------------- | ----------------------------------------------------------- |
| User registers              | `users`         | New user document (name, email, hashed password + defaults) |
| User updates profile        | `users`         | Updated name, phone, address, gender, dob, image URL        |
| Admin adds doctor           | `doctors`       | New doctor document (all fields)                            |
| Admin/Doctor toggles avail. | `doctors`       | `available` boolean flipped                                 |
| Doctor updates profile      | `doctors`       | Updated fees, address, about, available                     |
| User books appointment      | `appointments`  | New appointment doc + doctor's `slots_booked` updated       |
| User cancels appointment    | `appointments`  | `cancelled` → true + doctor's `slots_booked` slot released  |
| Admin cancels appointment   | `appointments`  | `cancelled` → true (slot NOT released)                      |
| Doctor cancels appointment  | `appointments`  | `cancelled` → true (slot NOT released)                      |
| Doctor completes appt.      | `appointments`  | `isCompleted` → true                                        |
| Payment verified            | `appointments`  | `payment` → true                                            |

### ✅ Saved on Cloudinary

| Action                  | What's Stored            |
| ----------------------- | ------------------------ |
| Admin adds doctor       | Doctor profile image     |
| User updates profile    | User profile image       |

### ❌ NOT Saved Anywhere (Stateless / Client-Only)

| Item                          | Why                                                    |
| ----------------------------- | ------------------------------------------------------ |
| JWT tokens                    | Stateless — stored only in client `localStorage`        |
| Admin credentials             | Hardcoded in env vars, no DB record                     |
| Doctor list browsing          | Read-only API call, no tracking                         |
| Speciality filtering          | Done client-side, no server request                     |
| Slot selection (before book)  | Component state only, saved when "Book" is clicked      |
| About/Contact page content    | Hardcoded in JSX, static pages                          |
| Dashboard statistics          | Computed on-the-fly from DB queries, not cached          |
| Search/filter state           | React component state only                              |

---

## API Endpoints Reference

### User Routes (`/api/user`)

| Method | Endpoint              | Auth     | Description                     |
| ------ | --------------------- | -------- | ------------------------------- |
| POST   | `/register`           | ❌ None  | Register new patient            |
| POST   | `/login`              | ❌ None  | Login patient                   |
| GET    | `/get-profile`        | 🔐 User | Get user profile data           |
| POST   | `/update-profile`     | 🔐 User | Update profile (multipart)      |
| POST   | `/book-appointment`   | 🔐 User | Book a doctor appointment       |
| GET    | `/appointments`       | 🔐 User | List user's appointments        |
| POST   | `/cancel-appointment` | 🔐 User | Cancel an appointment           |
| POST   | `/payment-stripe`     | 🔐 User | Create Stripe checkout session  |
| POST   | `/verifyStripe`       | 🔐 User | Verify Stripe payment           |

### Admin Routes (`/api/admin`)

| Method | Endpoint               | Auth      | Description                     |
| ------ | ---------------------- | --------- | ------------------------------- |
| POST   | `/login`               | ❌ None   | Admin login (env var creds)     |
| POST   | `/add-doctor`          | 🔐 Admin | Add new doctor (multipart)      |
| GET    | `/appointments`        | 🔐 Admin | Get ALL appointments            |
| POST   | `/cancel-appointment`  | 🔐 Admin | Cancel any appointment          |
| GET    | `/all-doctors`         | 🔐 Admin | List all doctors                |
| POST   | `/change-availability` | 🔐 Admin | Toggle doctor availability      |
| GET    | `/dashboard`           | 🔐 Admin | Get dashboard statistics        |

### Doctor Routes (`/api/doctor`)

| Method | Endpoint                | Auth       | Description                     |
| ------ | ----------------------- | ---------- | ------------------------------- |
| POST   | `/login`                | ❌ None    | Doctor login                    |
| GET    | `/list`                 | ❌ None    | Public doctor list (no email/pw)|
| GET    | `/appointments`         | 🔐 Doctor | Get doctor's appointments       |
| POST   | `/cancel-appointment`   | 🔐 Doctor | Cancel an appointment           |
| POST   | `/complete-appointment` | 🔐 Doctor | Mark appointment complete       |
| POST   | `/change-availability`  | 🔐 Doctor | Toggle own availability         |
| GET    | `/dashboard`            | 🔐 Doctor | Get doctor dashboard stats      |
| GET    | `/profile`              | 🔐 Doctor | Get own profile                 |
| POST   | `/update-profile`       | 🔐 Doctor | Update own profile              |

---

## File & Folder Structure

```
doctorappointment/
│
├── backend/                          # Express.js API Server
│   ├── server.js                     # App entry — Express setup, CORS, routes
│   ├── package.json                  # Dependencies: express, mongoose, bcrypt, jwt, etc.
│   ├── vercel.json                   # Vercel deployment config
│   ├── config/
│   │   ├── mongodb.js                # Mongoose connection setup
│   │   └── cloudinary.js             # Cloudinary SDK config
│   ├── models/
│   │   ├── userModel.js              # User schema (name, email, password, image, etc.)
│   │   ├── doctorModel.js            # Doctor schema (name, speciality, slots_booked, etc.)
│   │   └── appointmentModel.js       # Appointment schema (userId, docId, slot, payment, etc.)
│   ├── controllers/
│   │   ├── userController.js         # Register, login, profile, booking, payment logic
│   │   ├── adminController.js        # Admin login, add doctor, dashboard, manage appointments
│   │   └── doctorController.js       # Doctor login, appointments, profile, dashboard
│   ├── middleware/
│   │   ├── authUser.js               # JWT verification for users (header: token)
│   │   ├── authAdmin.js              # JWT verification for admin (header: atoken)
│   │   ├── authDoctor.js             # JWT verification for doctors (header: dtoken)
│   │   └── multer.js                 # File upload handling (disk storage)
│   └── routes/
│       ├── userRoute.js              # /api/user/* endpoints
│       ├── adminRoute.js             # /api/admin/* endpoints
│       └── doctorRoute.js            # /api/doctor/* endpoints
│
├── frontend/                         # Patient-facing React App
│   ├── src/
│   │   ├── App.jsx                   # Routes: /, /doctors, /login, /appointment/:id, etc.
│   │   ├── main.jsx                  # React entry point with BrowserRouter
│   │   ├── context/
│   │   │   └── AppContext.jsx        # Global state: doctors, token, userData, backendUrl
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Navigation bar with user dropdown
│   │   │   ├── Header.jsx            # Hero banner section
│   │   │   ├── SpecialityMenu.jsx    # Speciality icons grid
│   │   │   ├── TopDoctors.jsx        # Featured doctors carousel
│   │   │   ├── RelatedDoctors.jsx    # Same-speciality doctor suggestions
│   │   │   ├── Banner.jsx            # CTA banner
│   │   │   └── Footer.jsx            # Footer section
│   │   └── pages/
│   │       ├── Home.jsx              # Landing page
│   │       ├── Login.jsx             # Login / Register form
│   │       ├── Doctors.jsx           # Browse & filter doctors
│   │       ├── Appointment.jsx       # Doctor detail + slot booking
│   │       ├── MyAppointments.jsx    # User's appointment list + payment + cancel
│   │       ├── MyProfile.jsx         # User profile view & edit
│   │       ├── Verify.jsx            # Stripe payment verification redirect
│   │       ├── About.jsx             # Static about page
│   │       └── Contact.jsx           # Static contact page
│   └── ...config files (vite, tailwind, postcss, etc.)
│
├── admin/                            # Admin + Doctor React App (shared)
│   ├── src/
│   │   ├── App.jsx                   # Conditional rendering: Admin routes / Doctor routes / Login
│   │   ├── main.jsx                  # React entry point
│   │   ├── context/
│   │   │   ├── AdminContext.jsx      # Admin state: aToken, doctors, appointments, dashboard
│   │   │   ├── DoctorContext.jsx     # Doctor state: dToken, appointments, profile, dashboard
│   │   │   └── AppContext.jsx        # Shared utilities: backendUrl, currency, date formatting
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Top navbar with logout
│   │   │   └── Sidebar.jsx           # Left sidebar navigation
│   │   └── pages/
│   │       ├── Login.jsx             # Shared login (Admin / Doctor toggle)
│   │       ├── Admin/
│   │       │   ├── Dashboard.jsx     # Admin dashboard (stats + latest bookings)
│   │       │   ├── AddDoctor.jsx     # Add doctor form
│   │       │   ├── DoctorsList.jsx   # All doctors + availability toggle
│   │       │   └── AllAppointments.jsx # All appointments table
│   │       └── Doctor/
│   │           ├── DoctorDashboard.jsx  # Doctor dashboard (earnings + stats)
│   │           ├── DoctorAppointments.jsx # Doctor's appointment list
│   │           └── DoctorProfile.jsx    # Doctor profile view & edit
│   └── ...config files
│
└── README.md                         # Project readme
```

---

## Summary: Complete User Journey

```
Patient registers → saved to users collection (hashed password)
         │
         ▼
Patient logs in → JWT issued (not saved server-side)
         │
         ▼
Patient browses doctors → public API, no auth needed
         │
         ▼
Patient selects doctor + date + time slot
         │
         ▼
Patient clicks "Book" → appointment saved to DB + doctor slot_booked updated
         │
         ▼
Patient views appointments → sees all their bookings
         │
         ├──► Pay Online → Stripe checkout → payment verified → payment=true in DB
         │
         ├──► Cancel → cancelled=true in DB + slot freed on doctor
         │
         └──► Wait for doctor to mark complete → isCompleted=true in DB

Admin logs in (env var credentials) → manages the system
         │
         ├──► Add Doctor → saved to doctors collection (image on Cloudinary)
         ├──► View/Toggle doctor availability → available field toggled
         ├──► View all appointments → read-only
         └──► Cancel any appointment → cancelled=true in DB

Doctor logs in (credentials set by admin) → manages own practice
         │
         ├──► View own appointments
         ├──► Mark complete → isCompleted=true
         ├──► Cancel appointment → cancelled=true
         └──► Edit profile → update fees, address, about, availability
```
