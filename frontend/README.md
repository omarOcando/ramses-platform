# Frontend Application

React client application for the Ramses Relationship Coaching Platform.

Built with **React + Vite** and structured using a modular **SCSS architecture**.

---

## Tech Stack

* React
* React Router
* Context API
* SCSS
* Vite

---

## Architecture

The frontend follows a modular architecture:

**Pages** contain main application views
**Components** contain reusable UI elements
**Context** manages global state (authentication)
**Services** handle API communication with the backend
**Routes** protect private sections of the application

---

## Folder Structure

src
│
├── assets
│
├── components
│   └── layout
│
├── context
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

## Features

* Authentication
* Protected routes
* Appointment booking interface
* Dashboard
* Personal appointments view
* Responsive layout
* Modular SCSS styling

---

## Run Project

Install dependencies:
npm install

Start development server:
npm run dev

Application runs on:
http://localhost:5173

---

## Styling Architecture

The project uses a structured SCSS architecture:

styles
├── abstracts
├── base
├── components
└── pages

This structure allows scalable styling and component-based organization.