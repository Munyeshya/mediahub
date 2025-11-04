// /server/server.js (UPDATED with /api/admin/givers route)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import * as db from './db.js'; // Imports all real database functions from /server/db.js

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001; 

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Allows requests from your React app's URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type'], 
}));
app.use(express.json()); // Allows parsing of JSON request bodies

// -------------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------------

// --- 1. AUTHENTICATION ROUTE (Login) ---
app.post('/api/login', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const user = await db.authenticateLogin(email, password, role); // Call to /server/db.js
        if (user) {
            // Success: Return user ID and role
            res.status(200).json(user);
        } else {
            // Failure: Credentials not found or password mismatch
            res.status(401).json({ message: "Invalid credentials or role." });
        }
    } catch (error) {
        console.error('Server error during login:', error);
        res.status(500).json({ message: "Server encountered an error. Check logs." });
    }
});


// --- 2. ADMIN DASHBOARD ROUTE (Overview Metrics & Charts) ---
app.get('/api/admin/dashboard', async (req, res) => {
    // NOTE: In a real app, you'd add middleware here to check if the user is an Admin
    try {
        const data = await db.fetchDashboardOverviewData(); // Call to /server/db.js
        res.status(200).json(data);
    } catch (error) {
        console.error('Dashboard data error:', error);
        res.status(500).json({ message: "Failed to fetch dashboard data." });
    }
});


// --- 3. ADMIN MANAGE GIVERS ROUTE (List all Givers - 💥 NEW) ---
app.get('/api/admin/givers', async (req, res) => {
    // NOTE: In a real app, you'd add middleware here to check if the user is an Admin
    try {
        // Calls the new function in /server/db.js to fetch the list
        const givers = await db.fetchGiversFromDB(); 
        res.status(200).json(givers);
    } catch (error) {
        console.error('Manage Givers error:', error);
        res.status(500).json({ message: "Failed to fetch service giver list." });
    }
});


// --- 4. SYSTEM SETTINGS ROUTES (GET) ---
app.get('/api/admin/settings', async (req, res) => {
    // NOTE: In a real app, you'd add middleware here to check if the user is an Admin
    try {
        const settings = await db.getSystemSettings();
        res.status(200).json(settings);
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({ message: "Failed to retrieve system settings." });
    }
});


// --- 5. SYSTEM SETTINGS ROUTES (POST/UPDATE) ---
app.post('/api/admin/settings', async (req, res) => {
    // NOTE: In a real app, you'd add middleware here to check if the user is an Admin
    const settings = req.body;
    try {
        await db.updateSystemSettings(settings);
        res.status(200).json({ message: "Settings updated successfully." });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({ message: "Failed to save settings. See server logs." });
    }
});


// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`API Base URL: http://localhost:${PORT}/api`);
});