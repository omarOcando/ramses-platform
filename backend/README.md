# Backend API

Node.js + Express REST API for the Ramses Relationship Coaching Platform.

Responsible for:

* User authentication
* Appointment management
* Availability scheduling
* Google Calendar integration
* Contact synchronization with Systeme.io

---

## Tech Stack

* Node.js
* Express
* MongoDB
* Mongoose
* JWT
* Google Calendar API

---

## Architecture

The backend follows a modular architecture:

* Controllers handle business logic
* Models define MongoDB schemas
* Routes define API endpoints
* Middleware manages authentication and authorization
* Utilities provide reusable services such as JWT and Google Calendar integration

---

## Folder Structure

src
│
├── api
│   ├── controllers
│   ├── models
│   └── routes
│
├── config
│   └── db.js
│
├── middleware
│   ├── isAuth.js
│   └── isAdmin.js
│
├── seeds
│
└── utils
    ├── jwt.js
    └── googleCalendar.js

---

## API Endpoints

### Auth / Users

POST /api/users/register
POST /api/users/login
GET /api/users/profile

---

### Appointments

GET /api/appointments
GET /api/appointments/my
POST /api/appointments
PATCH /api/appointments/:id
DELETE /api/appointments/:id

---

### Availability

GET /api/availability
POST /api/availability

---

## Run Server

Install dependencies:
npm install

Start development server:
npm run dev

Server runs on:
http://localhost:3000

---

## Environment Variables

Create ".env" file in the root of the backend folder.

Example:

MONGO_URI=
PORT=3000
JWT_SECRET=
GOOGLE_APPLICATION_CREDENTIALS=
EMAIL_USER=
EMAIL_PASS=
SYSTEME_API_KEY=

---

## Security

Authentication is handled using JSON Web Tokens (JWT).
Protected routes require a valid token and some endpoints require admin privileges.