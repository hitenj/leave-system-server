📝 Leave Management System

A full-stack Leave Management System built with React (frontend), Node.js + Express (backend), and MySQL (via Railway) for managing employee leaves with roles like Admin, Manager, and Employee.

🔗 Live Links

Frontend (Vercel): https://leave-system-client.vercel.app

Backend (Render): https://leave-system-server.onrender.com



---

📌 Features

👤 User Roles

Admin:

View, edit, reset all leave balances

See system audit logs


Manager:

Approve/reject leave requests


Employee:

Apply for leave

View leave status and balance



🧮 Leave Management

Apply for casual or sick leave

Automatic deduction from leave balance

Reset yearly leave balances (admin-only)

View personal leave history


🔐 Authentication

JWT-based login with role-based dashboard routing

Token stored in localStorage for persistent sessions



---

⚙️ Tech Stack

Layer	Tech Used

Frontend	React, React Router, Axios
Backend	Node.js, Express, Sequelize (ORM)
Database	MySQL (hosted on Railway)
Hosting	Vercel (frontend), Render (backend)



---

🛠 Setup Instructions

1. Clone Repositories

git clone https://github.com/<your-username>/leave-system-client
git clone https://github.com/<your-username>/leave-system-server

2. Environment Variables

Create a .env file in the server directory:

JWT_SECRET=your_secret_key

DB_USER=root
DB_PASSWORD=your_mysql_password
DB_HOST=your_mysql_host
DB_PORT=your_mysql_port
DB_NAME=railway
DB_DIALECT=mysql

3. Install Dependencies

Client:


cd leave-system-client
npm install

Server:


cd leave-system-server
npm install

4. Run Locally

# client
npm start

# server
npm run dev


---

🚀 Deployment Notes

Frontend deployed to Vercel

Backend deployed to Render

Database hosted on Railway

Make sure to configure CORS and .env properly on Render

Use seed script (seed.js) to populate initial users and leave balances



---

📦 Seed Users

Admin:    admin@example.com / password123
Manager:  manager1@example.com / password123
Employee: employee1@example.com / password123


---

📄 Screens & Functionality

Login Pages (per role)

Admin Dashboard

Leave balances table (editable)
Audit log table
Reset balances button


Manager Dashboard

View & approve/reject leave requests


Employee Dashboard

Apply leave
Leave history




---

📁 Folder Structure

leave-system-client/
  src/
    pages/
    components/
    styles/
    utils/
    redux/

leave-system-server/
  models/
  routes/
  controllers/
  config/


---

📋 Notes

Clean coding standards and proper structure are maintained

Role-based access is enforced on both frontend and backend

Audit logs for admin actions are tracked

README contains full deployment and usage instructions
