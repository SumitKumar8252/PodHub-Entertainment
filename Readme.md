# 🎧 PodHub_Entertainment

**PodHub_Entertainment** is a full-stack short-form podcast hosting and management platform.  
It allows **creators** to upload 3-minute podcasts, **listeners** to stream and subscribe, and **admins** to manage the platform efficiently.  
The platform features secure authentication, role-based access, podcast analytics, notifications, and comment moderation.

---

## 🌟 Core Features

### 🔐 User Authentication & Role Management
- Secure registration and login using **JWT Authentication**.  
- Supports three roles:
  - **Creator** → Upload and manage podcasts.  
  - **Listener** → Stream, subscribe, and comment on episodes.  
  - **Admin** → Manage users, podcasts, and comments.  
- **Role-Based Access Control (RBAC)** ensures protected routes and permissions.

---

### 🎙️ Short-Form Podcast Management API
- Upload, update, and delete episodes via RESTful APIs.  
- Restrict audio uploads to **3 minutes maximum**.  
- Metadata support: title, description, tags, and duration.  
- Secure file upload and validation middleware using **Multer**.

---

### 📬 Subscription & Notification System
- Listeners can subscribe to creators and receive updates on new episodes.  
- Automated **email notifications** via **Nodemailer** and a third-party mail service (e.g., Gmail or SendGrid).  
- Unsubscribe functionality for managing subscriptions.  

---

### ☁️ Audio File Upload & Storage
- Integrated with **AWS S3** or **Firebase Storage** for scalable and secure file storage.  
- Stream podcast episodes directly through authenticated API endpoints.  
- Upload process includes:
  - File validation
  - Size/duration restriction
  - Secure public/private access links

---

### 💬 Commenting System
- APIs for adding, editing, and deleting comments on episodes.  
- Creators can **moderate comments** and **reply** to listener feedback.  
- Admins can remove inappropriate comments globally.  

---

### 📊 Podcast Analytics API
- Track and expose metrics such as:
  - Total Plays
  - Likes
  - Comments
  - Subscriptions
  - Downloads  
- Accessible via analytics endpoints for creators and admins.

---

### 🧪 API Testing
- All APIs tested using **Mocha** or **Jest** frameworks.  
- Integration and unit tests ensure API reliability and correctness.  
- Includes Postman collection for manual testing.

---

## 🏗️ Project Structure

PodHub/
│
├── backend/            # Express.js + MongoDB backend
│ ├── config/           # DB, AWS/Firebase setup
│ ├── controllers/      # Business logic & route handlers
│ ├── middleware/       # Auth, validation, upload
│ ├── models/           # Mongoose schemas
│ ├── routes/           # API endpoints
│ ├── tests/            # Jest or Mocha test cases
│ ├── utils/            # Reusable helpers (email, analytics)
│ ├── server.js         # Entry point
│ ├── .env              # Environment variables
│ └── package.json
│
├── frontend/           # React + Vite frontend
│ ├── src/
│ │ ├── components/     # Reusable UI components
│ │ ├── pages/          # Home, Upload, Analytics, etc.
│ │ ├── context/        # Auth & Theme management
│ │ ├── utils/          # API configs
│ │ ├── main.jsx
│ │ └── App.jsx
│ ├── public/
│ ├── .env
│ └── package.json
│
├── .gitignore
└── README.md