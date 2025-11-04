import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Import all your database functions
import * as db from './db.js'; 

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001; // Use port 3001 for the server

// Middleware
// 1. CORS: Allows requests from your React app (on port 5173 or similar)
app.use(cors({
    origin: 'http://localhost:5173', // Adjust this to your React app's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json()); // Allows parsing of JSON request bodies

// --- AUTHENTICATION ROUTE EXAMPLE ---
app.post('/api/login', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const user = await db.authenticateLogin(email, password, role);
        if (user) {
            // Success: Return user ID and role
            res.status(200).json(user);
        } else {
            // Failure: Credentials not found
            res.status(401).json({ message: "Invalid credentials or role." });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: "Server error during authentication." });
    }
});

// --- ADMIN DASHBOARD ROUTE EXAMPLE ---
app.get('/api/admin/dashboard', async (req, res) => {
    // NOTE: In a real app, you'd add middleware here to check if the user is an Admin
    try {
        const data = await db.fetchDashboardOverviewData();
        res.status(200).json(data);
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ message: "Failed to fetch dashboard data." });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});