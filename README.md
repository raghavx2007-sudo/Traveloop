TravelLoop 🌍
A modern full-stack travel planning platform that helps users organize, manage, and share trips with an immersive and interactive user experience.
TravelLoop combines a sleek React frontend with a scalable Node.js backend to provide seamless trip management, budgeting, activity planning, public trip sharing, analytics, and community-driven exploration.
---

✨ Features
🔐 Authentication & User Management

Secure JWT-based authentication
User registration and login
Profile management
Protected routes and authorization

✈️ Trip Management

Create and manage trips
Add destinations and trip stops
Organize activities and schedules
Public trip sharing
Interactive trip dashboard

📊 Travel Planning Tools

Budget tracking
Travel checklists
Notes and itinerary management
Trip analytics and insights
Calendar-based trip organization

🎨 Modern User Experience

Responsive UI design
Smooth animations using GSAP and Framer Motion
Cinematic scroll effects
Interactive components and immersive visuals
Dark/light theme support

🌐 Community Features

Explore public trips
Community travel inspiration
Shared travel experiences

---
🛠️ Tech Stack
Frontend:

React 18
Vite
Tailwind CSS
Framer Motion
GSAP
React Router DOM
Axios
Lucide React

Backend:

Node.js
Express.js
MongoDB
Mongoose
JWT Authentication
Multer
Express Validator

---

📁 Project Structure

Travel/
├── client/                 # Frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
│
├── server/                 # Backend API
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── utils/
│
└── database/
    └── schema.sql

---

⚙️ Installation & Setup

1️⃣ Clone the Repository
git clone https://github.com/your-username/travelloop.git
cd travelloop

---

2️⃣ Setup the Backend
cd server
npm install

Create a .env file inside the server folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173

Run the backend server:
npm run dev

Backend runs on:
http://localhost:5000

---

3️⃣ Setup the Frontend
cd client
npm install
npm run dev

Frontend runs on:
http://localhost:5173

---

📌 Available Scripts
Frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build

Backend
npm run dev      # Start development server with nodemon
npm start        # Start production server

---

🔗 API Modules

The backend includes modular APIs for:
Authentication
User profiles
Trips
Trip stops
Activities
Budgets
Checklists
Notes
Public trip access

---

📸 Screens & Pages

Dashboard
Explore Page
Community Page
My Trips
Trip Details
Billing
Analytics
Profile & Settings
Authentication Pages

---

🚀 Future Improvements

Real-time collaboration
AI-powered trip recommendations
Google Maps integration
Flight & hotel booking integration
Push notifications
Offline support

Mobile application
---
🤝 Contributing

Contributions are welcome.
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to your branch
5. Open a Pull Request

---
📄 License

This project is licensed under the MIT License.

---

👨‍💻 Author
Developed with passion for modern travel experiences and immersive web applications.
