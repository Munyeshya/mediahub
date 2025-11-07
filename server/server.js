// server/server.js (top of file)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import * as db from './db.js'; // Import your DB functions

// --- FIX: create the Express app before using app.use(...) ---
const app = express();

// Load .env from the same folder as this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json());


// --- 1. AUTHENTICATION ROUTE ---
app.post('/api/login', async (req, res) => {
    const { email, password, role } = req.body;
    try {
        const user = await db.authenticateLogin(email, password, role); 
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(401).json({ message: "Invalid credentials or role." });
        }
    } catch (error) {
        console.error('Server error during login:', error);
        res.status(500).json({ message: "Server encountered an error. Check logs." });
    }
});


// --- 2. ADMIN DASHBOARD ROUTE ---
app.get('/api/admin/dashboard', async (req, res) => {
    try {
        const data = await db.fetchDashboardOverviewData();
        res.status(200).json(data);
    } catch (error) {
        console.error('Dashboard GET error:', error);
        res.status(500).json({ message: "Failed to fetch dashboard data." });
    }
});


// --- 3. ADMIN MANAGE GIVERS ROUTES (UPDATED) ---

// GET /api/admin/givers: Fetch all givers
app.get('/api/admin/givers', async (req, res) => {
    try {
        const givers = await db.fetchGivers();
        res.status(200).json(givers);
    } catch (error) {
        console.error('Manage Givers GET error:', error);
        res.status(500).json({ message: "Failed to fetch service giver list." });
    }
});

// 💥 NEW ROUTE: PUT /api/admin/givers/:giverId/status
app.put('/api/admin/givers/:giverId/status', async (req, res) => {
    const { giverId } = req.params;
    const { isVerified } = req.body; 

    // Basic validation
    if (isVerified === undefined || typeof isVerified !== 'boolean') {
        return res.status(400).json({ message: "Missing or invalid 'isVerified' status (must be a boolean)." });
    }
    
    // Ensure giverId is a number
    const id = parseInt(giverId, 10);
    if (isNaN(id)) {
        return res.status(400).json({ message: "Invalid Giver ID format." });
    }

    try {
        // This database function will be added next
        const success = await db.updateGiverStatus(id, isVerified);
        
        if (success) {
            res.status(200).json({ message: "Giver status updated successfully." });
        } else {
            // This is a reasonable response if the ID wasn't found in the DB
            res.status(404).json({ message: `Giver with ID ${id} not found.` });
        }
    } catch (error) {
        console.error(`Giver Status Update error for ID ${id}:`, error);
        res.status(500).json({ message: "Server error during giver status update. Check server logs." });
    }
});


// --- 4. SYSTEM SETTINGS ROUTES ---
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

// server/server.js (near other admin routes)
app.get('/api/admin/usage', async (req, res) => {
  const months = parseInt(req.query.months || '12', 10);
  try {
    const usage = await db.fetchUsageData(months);
    res.status(200).json({ usage });
  } catch (err) {
    console.error('Usage endpoint error:', err);
    res.status(500).json({ message: "Failed to fetch usage data." });
  }
});

// Load port from .env or default to 3001
const PORT = process.env.PORT || 3001;
// --- START SERVER ---
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Access the backend at http://localhost:${PORT}`);
});