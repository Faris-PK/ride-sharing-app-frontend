🚗 Ride-Sharing App (Frontend)
📌 Overview
This is the frontend of the Ride-Sharing Application, built using React and Google Maps API. It allows users to request rides, view optimized routes, and track rides in real-time.

⚙️ Setup & Installation
1️⃣ Clone the Repository
sh
Copy
Edit
git clone https://github.com/your-username/your-repo.git
cd your-repo
2️⃣ Install Dependencies
sh
Copy
Edit
npm install
3️⃣ Configure Environment Variables
Create a .env file in the project root and add the following values:

ini
Copy
Edit
VITE_API_URL=YOUR_BACKEND_API_URL
VITE_BACKEND_URL=YOUR_BACKEND_URL
VITE_GOOGLE_MAPS_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
🔴 Important:

Replace YOUR_BACKEND_API_URL with your actual backend API URL.

Replace YOUR_BACKEND_URL with your backend base URL.

Replace YOUR_GOOGLE_MAPS_API_KEY with your Google Maps API Key (Do NOT share it publicly).

🚀 Running the App
Once the setup is complete, start the development server with:

sh
Copy
Edit
npm run dev
This will run the app on http://localhost:5173/ or an available port.

📌 Features
✅ Google Maps Integration – Optimized route calculation
✅ Ride Requests – Passengers can request rides
✅ Driver Dashboard – Drivers can accept rides
✅ Real-time Updates – WebSockets for live ride tracking
✅ JWT Authentication – Secure login & signup