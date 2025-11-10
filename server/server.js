// server/server.js (top of file)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import * as db from './db.js'; // Import your DB functions
import { fetchServices, addService, updateService, deleteService } from "./db.js";

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

// ===============================================
//  CLIENT DASHBOARD ROUTE
// ===============================================
app.get("/api/client/:clientId/dashboard", async (req, res) => {
  const { clientId } = req.params;
  try {
    const dashboard = await db.fetchClientDashboardData(clientId);
    res.status(200).json(dashboard);
  } catch (error) {
    console.error("Error fetching client dashboard data:", error);
    res.status(500).json({ message: "Failed to load client dashboard." });
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

app.get('/api/admin/usage', async (req, res) => {
    try {
        const data = await db.fetchUsageData(); // we'll add this function next
        res.status(200).json({ usage: data });
    } catch (error) {
        console.error('Usage data fetch error:', error);
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

// =========================================================
// 🧑‍🎨  FETCH ALL GIVERS (CREATIVES) FOR MANAGE GIVERS PAGE
// =========================================================
app.get("/api/admin/givers", async (req, res) => {
    try {
        const sql = `
            SELECT 
                g.giver_id AS id,
                g.email,
                COALESCE(p.city, 'Unknown') AS city,
                COALESCE(p.status, 'Pending') AS status,
                COALESCE(p.bio, '') AS bio,
                CASE
                    WHEN s.service_name IS NOT NULL THEN s.service_name
                    ELSE 'Unassigned'
                END AS service,
                COALESCE(p.avg_rating, 0.0) AS avg_rating
            FROM service_giver g
            LEFT JOIN profile p ON g.giver_id = p.giver_id
            LEFT JOIN giver_service_price gsp ON g.giver_id = gsp.giver_id
            LEFT JOIN service_type s ON gsp.service_id = s.service_id
            ORDER BY g.created_at DESC;
        `;
        const givers = await executeSql(sql);
        res.json(givers);
    } catch (error) {
        console.error("[ERROR] Fetch Givers:", error);
        res.status(500).json({ message: "Failed to fetch givers." });
    }
});


// =========================================================
// 🔄  UPDATE GIVER STATUS (Active / Suspended / Pending)
// =========================================================
app.put("/api/admin/givers/:id/status", async (req, res) => {
    const giverId = req.params.id;
    const { status } = req.body;

    try {
        const sql = `UPDATE profile SET status = ? WHERE giver_id = ?`;
        await executeSql(sql, [status, giverId]);
        res.json({ message: "Giver status updated successfully." });
    } catch (error) {
        console.error("[ERROR] Update Giver Status:", error);
        res.status(500).json({ message: "Failed to update giver status." });
    }
});

// --- SERVICES MANAGEMENT ROUTES ---



// Fetch all services
app.get("/api/admin/services", async (req, res) => {
  try {
    const services = await fetchServices();
    res.status(200).json(services);
  } catch (error) {
    console.error("Error fetching services:", error);
    res.status(500).json({ message: "Failed to fetch service list." });
  }
});

// Add a new service
app.post("/api/admin/services", async (req, res) => {
  try {
    const newService = await addService(req.body);
    res.status(201).json(newService);
  } catch (error) {
    console.error("Error adding service:", error);
    res.status(500).json({ message: "Failed to add service." });
  }
});

// Update service
app.put("/api/admin/services/:id", async (req, res) => {
  try {
    const updated = await updateService(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating service:", error);
    res.status(500).json({ message: "Failed to update service." });
  }
});

// Delete service
app.delete("/api/admin/services/:id", async (req, res) => {
  try {
    const deleted = await deleteService(req.params.id);
    res.status(200).json({ success: deleted });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({ message: "Failed to delete service." });
  }
});


// --- GET DETAILED GIVER PROFILE ---
app.get("/api/admin/givers/:giverId", async (req, res) => {
  const { giverId } = req.params;

  try {
    const giver = await db.fetchGiverDetails(giverId);

    if (!giver) {
      return res.status(404).json({ message: "Giver not found" });
    }

    res.status(200).json(giver);
  } catch (error) {
    console.error("Error fetching giver details:", error);
    res.status(500).json({ message: "Failed to fetch giver details." });
  }
});

// --- CLIENT DASHBOARD DATA ---
app.get("/api/client/dashboard/:clientId", async (req, res) => {
  const { clientId } = req.params;

  try {
    const data = await db.fetchClientDashboard(clientId);
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching client dashboard:", error);
    res.status(500).json({ message: "Failed to fetch client dashboard data." });
  }
});

// --- CLIENT DASHBOARD OVERVIEW ---
app.get("/api/client/:clientId/dashboard", async (req, res) => {
  const { clientId } = req.params;
  try {
    const clientData = await db.fetchClientDashboardData(clientId);
    res.status(200).json(clientData);
  } catch (error) {
    console.error("Client Dashboard Error:", error);
    res.status(500).json({ message: "Failed to fetch client dashboard data." });
  }
});

// ✅ CLIENT BOOKINGS ENDPOINT
app.get("/api/client/:clientId/bookings", async (req, res) => {
  const { clientId } = req.params;

  try {
    const bookings = await db.fetchClientBookings(clientId);
    res.json(bookings);
  } catch (err) {
    console.error("Error fetching client bookings:", err);
    res.status(500).json({ message: "Failed to fetch client bookings." });
  }
});

// ------------------------------
// CLIENT BOOKING DETAILS ROUTE
// ------------------------------
app.get('/api/bookings/:id', async (req, res) => {
  const bookingId = req.params.id;
  try {
    const booking = await db.fetchBookingDetails(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    res.json(booking);
  } catch (error) {
    console.error("Booking details fetch error:", error);
    res.status(500).json({ message: "Failed to fetch booking details." });
  }
});

// ------------------------------
// CLIENT REVIEW SUBMISSION ROUTE
// ------------------------------
app.post('/api/reviews', async (req, res) => {
  const { booking_id, giver_id, client_id, rating, comment } = req.body;
  try {
    await db.submitReview(booking_id, giver_id, client_id, rating, comment);
    res.status(201).json({ message: "Review submitted successfully!" });
  } catch (error) {
    console.error("Review submission error:", error);
    res.status(500).json({ message: "Failed to submit review." });
  }
});

app.get('/api/bookings/:id/review', async (req, res) => {
  const { id } = req.params;
  try {
    const review = await db.fetchBookingReview(id);
    if (!review) return res.status(404).json({ message: "No review found" });
    res.json(review);
  } catch (error) {
    console.error("Error fetching booking review:", error);
    res.status(500).json({ message: "Failed to fetch booking review" });
  }
});


app.get('/api/bookings/:id/review', async (req, res) => {
  const { id } = req.params;
  try {
    const review = await db.fetchReviewByBooking(id);
    if (!review) return res.status(204).send(); // No review found
    res.status(200).json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ message: "Failed to fetch review." });
  }
});

// ✅ Fetch a review for a booking
app.get("/api/bookings/:id/review", async (req, res) => {
  const { id } = req.params;
  try {
    const review = await db.fetchReviewByBooking(id);
    if (!review) return res.status(204).send(); // no content if none exists
    res.status(200).json(review);
  } catch (error) {
    console.error("Error fetching review:", error);
    res.status(500).json({ message: "Failed to fetch review." });
  }
});

// ✅ Create a new review
app.post("/api/reviews", async (req, res) => {
  const { booking_id, giver_id, client_id, rating, comment } = req.body;
  try {
    const newReview = await db.addReview({ booking_id, giver_id, client_id, rating, comment });
    res.status(201).json(newReview);
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({ message: "Failed to add review." });
  }
});

// ✅ Update existing review
app.put("/api/reviews/:id", async (req, res) => {
  const { id } = req.params;
  const { rating, comment } = req.body;
  try {
    const updated = await db.updateReview(id, rating, comment);
    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Failed to update review." });
  }
});

app.get("/api/giver/:id/dashboard", async (req, res) => {
  const { id } = req.params;
  try {
    const dashboard = await db.fetchGiverDashboard(id);
    if (!dashboard) return res.status(404).json({ message: "Giver not found" });
    res.status(200).json(dashboard);
  } catch (error) {
    console.error("Error loading giver dashboard:", error);
    res.status(500).json({ message: "Failed to load giver dashboard." });
  }
});

// Fetch giver’s services
app.get("/api/giver/:id/services", async (req, res) => {
  const { id } = req.params;
  try {
    const services = await db.fetchGiverServices(id);
    res.status(200).json(services);
  } catch (err) {
    console.error("Error fetching giver services:", err);
    res.status(500).json({ message: "Failed to load giver services." });
  }
});

// Update service price
app.put("/api/giver/:id/services/:serviceId", async (req, res) => {
  const { id, serviceId } = req.params;
  const { price_RWF } = req.body;
  try {
    await db.updateGiverServicePrice(id, serviceId, price_RWF);
    res.status(200).json({ message: "Price updated successfully." });
  } catch (err) {
    console.error("Error updating giver price:", err);
    res.status(500).json({ message: "Failed to update service price." });
  }
});

// Toggle service visibility (active/inactive)
app.put("/api/giver/:id/services/:serviceId/visibility", async (req, res) => {
  const { id, serviceId } = req.params;
  const { is_active } = req.body;

  try {
    await db.updateGiverServiceVisibility(id, serviceId, is_active);
    res.status(200).json({ message: "Service visibility updated successfully." });
  } catch (err) {
    console.error("Error updating service visibility:", err);
    res.status(500).json({ message: "Failed to update service visibility." });
  }
});
// Fetch giver monthly earnings
app.get("/api/giver/:id/earnings", async (req, res) => {
  const { id } = req.params;
  try {
    const data = await db.fetchGiverEarnings(id);
    res.status(200).json(data);
  } catch (err) {
    console.error("Error fetching giver earnings:", err);
    res.status(500).json({ message: "Failed to load earnings data." });
  }
});






