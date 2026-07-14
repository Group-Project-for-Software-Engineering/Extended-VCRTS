# Distributed Vehicle Job Management System

A full‑stack web application for managing vehicles, client job requests, admin approvals, and real‑time vehicle heartbeat monitoring.  
Built with **React**, **Node.js**, **Express**, and **MySQL**.

---

## Features

### User Roles
The system supports three user types:

- **Admin**
  - Approves or rejects pending users jobs/vehicles
  - Removes users jobs/vehicles
  - Views all system activity
- **Owner**
  - Offers vehicles to the system
  - Receives notifications
- **Client**
  - Creates job requests
  - Views job status
  - Receives notifications

---

## Vehicle Management (Owner)
Owners can:

- Add vehicles
- View all vehicles
- See real‑time heartbeat status (Alive / Dead)
- Track last heartbeat timestamp
- View jobs assigned to each vehicle

---

## Job Management (Client)
Clients can:

- Submit job requests
- View job status (Pending, Assigned, Completed)
- See assigned vehicle (if any)
- Receive notifications when job status changes

---

## Notifications System
All user types receive notifications when:

- A job is created
- A job is assigned
- A job is completed
- A vehicle heartbeat fails
- Admin approves or removes a user

Notifications are stored in MySQL and fetched via API calls

---

## Distributed System Dashboard
A real‑time dashboard showing:

### Vehicles
- ID, Make, Model, VIN  
- Alive/Dead status  
- Last heartbeat timestamp  

### Jobs
- ID, Description  
- Status  
- Assigned vehicle  
- Deadline  

---

## Tech Stack

### Frontend
- React
- React Router
- CSS Modules

### Backend
- Node.js
- Express
- MySQL
- REST API architecture

### Database
- MySQL with multiple relational tables:
  - `users`
  - `vehicles`
  - `jobs`
  - `notifications`
  - `pending_jobs`
  - `pending_vehicles`
  - `vehicle_heartbeats`

```
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    userType ENUM('Admin', 'Client', 'Owner') NOT NULL
);

CREATE TABLE vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ownerId INT NOT NULL,
    vin VARCHAR(17) NOT NULL UNIQUE,
    make VARCHAR(100),
    model VARCHAR(100),
    plate VARCHAR(20),
    year INT,
    arrival DATETIME,
    departure DATETIME,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ownerId) REFERENCES users(id)
);

CREATE TABLE pending_vehicles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ownerId INT NOT NULL,
    vin VARCHAR(17) NOT NULL,
    make VARCHAR(100),
    model VARCHAR(100),
    plate VARCHAR(20),
    year INT,
    arrival DATETIME,
    departure DATETIME,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ownerId) REFERENCES users(id)
);

CREATE TABLE jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clientId INT NOT NULL,
    description VARCHAR(255),
    assignedVehicleId INT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    duration DECIMAL(10,2),
    deadline DATETIME,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (clientId) REFERENCES users(id)
);

CREATE TABLE pending_jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    clientId INT NOT NULL,
    description VARCHAR(255),
    duration DECIMAL(10,2),
    deadline DATETIME,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (clientId) REFERENCES users(id)
);

CREATE TABLE notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    userId INT NOT NULL,
    message VARCHAR(255) NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id)
);
  
CREATE TABLE vehicle_heartbeats (
  vehicleId INT NOT NULL,
  lastHeartbeat TIMESTAMP NOT NULL,
  PRIMARY KEY (vehicleId)
);
```
---

## Project Structure
backend/
controllers/
routes/
config/
server.js

frontend/
src/
components/
pages/
styles/
App.jsx

---

## Environment Variables

Create a `.env` file inside **backend/**:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=yourdbname
PORT=5000


---

##  Installation & Setup

### Clone the repository

```bash
git clone <your-repo-url>
cd <project-folder>
```
### Set Up the Backend
```bash
cd backend
npm install
node server.js
```

### Set Up the Frontend
```bash
cd frontend
npm install
npm start
```
---
