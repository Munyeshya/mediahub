// /server/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as db from './db.js'; // Imports all real database functions

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001; 

// Middleware
// 1. CORS: Allows requests from your React app (on port 5173 by default)
app.use(cors({
    origin: 'http://localhost:5173', // Adjust this to your React app's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'], // Ensure necessary headers are allowed
}));
app.use(express.json()); // Allows parsing of JSON request bodies

// --- 1. AUTHENTICATION ROUTE ---
app.post('/api/login', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const user = await db.authenticateLogin(email, password, role); 
        if (user) {
            // Success: Return user ID and role
            res.status(200).json(user);
        } else {
            // Failure: Credentials not found (handled in the client logic)
            res.status(401).json({ message: "Invalid credentials or role." });
        }
    } catch (error) {
        // Database connection or unexpected server error
        console.error('Server error during login:', error);
        res.status(500).json({ message: "Server encountered an error. Check logs." });
    }
});


// --- 2. ADMIN DASHBOARD ROUTE ---
app.get('/api/admin/dashboard', async (req, res) => {
    // In a production app, you would add authentication middleware here
    try {
        const data = await db.fetchDashboardOverviewData();
        res.status(200).json(data);
    } catch (error) {
        console.error('Dashboard error:', error);
        res.status(500).json({ message: "Failed to fetch dashboard data." });
    }
});


// --- 3. SYSTEM SETTINGS ROUTES ---
app.get('/api/admin/settings', async (req, res) => {
    try {
        const settings = await db.getSystemSettings();
        res.status(200).json(settings);
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ message: "Failed to retrieve system settings." });
    }
});

app.post('/api/admin/settings', async (req, res) => {
    const settings = req.body;
    try {
        await db.updateSystemSettings(settings);
        res.status(200).json({ message: "Settings updated successfully." });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ message: "Failed to save system settings." });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`Connecting to Database: ${process.env.DB_NAME} at ${process.env.DB_HOST}:${process.env.DB_PORT}`);
});