# Frontend Application

![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=flat&logo=sass&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=flat&logo=react-router&logoColor=white)

React client application for the Ramses Relationship Coaching Platform.

Built with **React + Vite** and structured using a modular **SCSS architecture**.

---

## ⚙️ Tech Stack

* React
* React Router
* Context API
* SCSS
* Vite

---

## 🏗️ Architecture

The frontend follows a modular architecture:

**Pages** contain main application views
**Components** contain reusable UI elements
**Context** manages global state (authentication)
**Services** handle API communication with the backend
**Routes** protect private sections of the application

---

## 📁 Folder Structure

src
│
├── assets
│
├── components
│   └── layout
│
├── context
│
├── hooks
│
├── pages
│
├── routes
│
├── services
│
└── styles
    ├── abstracts
    ├── base
    ├── components
    │   └── layout
    │
    └── pages

---

## ✅ Features

* Authentication
* Protected routes
* Appointment booking interface
* Dashboard
* Personal appointments view
* Responsive layout
* Modular SCSS styling

---

## 🚀 Run Project

Install dependencies:
```bash
npm install
```

Start development server:
```bash
npm run dev
```

Application runs on: `http://localhost:5173`

---

## 🎨 Styling Architecture

The project uses a structured SCSS architecture:

styles
├── abstracts
├── base
├── components
└── pages

This structure allows scalable styling and component-based organization.