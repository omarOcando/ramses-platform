# Ramses Relationship Coaching Platform

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=flat&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)

Full-stack web application for managing a relationship coaching service.
The platform allows users to register, log in, and book private coaching sessions through an integrated scheduling system.

The system is divided into two main parts:

**Frontend** – React + Vite client application
**Backend** – Node.js + Express API connected to MongoDB

---

## ⚙️ Tech Stack

### Frontend

* React
* React Router
* Context API
* SCSS architecture
* Vite

### Backend

* Node.js
* Express
* MongoDB
* JWT authentication
* Google Calendar API integration

---

## ✅ Main Features

* User registration and login
* JWT authentication
* Private dashboard
* Appointment booking system
* Availability management
* Google Calendar synchronization
* Protected routes

---

## 📁 Project Structure

ramses-platform
│
├── backend
│   ├── src
│   │   ├── api
│   │   │   ├── controllers
│   │   │   ├── models
│   │   │   └── routes
│   │   ├── config
│   │   ├── data
│   │   ├── middleware
│   │   ├── seeds
│   │   └── utils
│
└── frontend
    ├── src
    │   ├── components
    │   ├── context
    │   ├── hooks
    │   ├── pages
    │   ├── routes
    │   ├── services
    │   └── styles

---

## 🚀 Installation

Clone the repository:

```bash
git clone https://github.com/yourusername/ramses-platform.git
cd ramses-platform
```

---

## 🖥️ Run Backend

```bash
cd backend
npm install
npm run dev
```

---

## 💻 Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Backend runs on: `http://localhost:3000`

Frontend runs on: `http://localhost:5173`

---

## 🔐 Environment Variables

Create a ".env" file inside the **backend** folder.

```env
MONGO_URI=
PORT=3000
JWT_SECRET=
GOOGLE_APPLICATION_CREDENTIALS=
EMAIL_USER=
EMAIL_PASS=
SYSTEME_API_KEY=
```

---

## 👤 Author

**Omar Ocando** · Full Stack Developer · Final Project thePower MBA
📧 omar.ocando@gmail.com · 📍 Cologne, Germany