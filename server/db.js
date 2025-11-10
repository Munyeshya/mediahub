// server/db.js (top of file)
import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load .env relative to this file (works if server started from project root)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '.env') });

// -------------------------------------------------------------------
// 1. DATABASE CONNECTION SETUP
// -------------------------------------------------------------------

// Create a connection pool using environment variables
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT, 
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

/**
 * Executes an SQL query against the database pool.
 * @param {string} sql - The SQL query string.
 * @param {Array<any>} params - Parameters for the query (prevents SQL injection).
 * @returns {Promise<Array<object>>} The rows returned by the query.
 */
async function executeSql(sql, params = []) {
    try {
        // The first element of the result array is the actual rows/result set
        const [rows] = await pool.query(sql, params); 
        return rows; 
    } catch (error) {
        console.error(`[DB Query Error] SQL: ${sql.substring(0, 50)}...`, error);
        throw new Error("Database query failed.");
    }
}

// -------------------------------------------------------------------
// 2. AUTHENTICATION LOGIC (Backend Handler)
// -------------------------------------------------------------------

/**
 * Authenticates a user against the database using their role to determine the table.
 * @returns {Promise<object|null>} Object {id, role} on successful login, or null on failure.
 */
export async function authenticateLogin(email, password, role) {
    let tableName = '';
    let idColumn = '';
    
    switch (role) {
        case 'Admin':
            tableName = 'Admin';
            idColumn = 'admin_id';
            break;
        case 'Client':
            tableName = 'Client';
            idColumn = 'client_id';
            break;
        case 'Giver':
            tableName = 'Service_Giver';
            idColumn = 'giver_id';
            break;
        default:
            console.warn(`[AUTH] Unknown role provided: ${role}`);
            return null;
    }

    const sql = `SELECT ${idColumn} AS id, password_hash FROM ${tableName} WHERE email = ?`;
    
    try {
        console.log(`[AUTH] Looking up user: email=${email}, role=${role}, table=${tableName}`);
        const rows = await executeSql(sql, [email]);

        // If executeSql returned an error-like object, guard
        if (!Array.isArray(rows)) {
            console.error('[AUTH] Unexpected result from executeSql:', rows);
            throw new Error('Unexpected DB response format.');
        }

        if (rows.length === 0) {
            console.log(`[AUTH] No user found with email ${email} in table ${tableName}.`);
            return null; // correct: not found
        }
        
        const user = rows[0];
        if (!user || !user.password_hash) {
            console.warn(`[AUTH] User row missing password_hash for email ${email}:`, user);
            return null;
        }

        const passwordMatch = await bcrypt.compare(password, user.password_hash);

        if (passwordMatch) {
            console.log(`[AUTH SUCCESS] User ${user.id} logged in as ${role}.`);
            return { id: user.id, role };
        } else {
            console.log(`[AUTH FAIL] Password mismatch for email ${email}.`);
            return null;
        }

    } catch (error) {
        console.error('Error during authenticateLogin (server/db.js):', error);
        // rethrow so the route returns 500 and we see the full stack in server logs
        throw error;
    }
}




// -------------------------------------------------------------------
// 3. ADMIN: DASHBOARD DATA (REAL QUERIES)
// -------------------------------------------------------------------

/**
 * Fetches all necessary metrics and chart data for the Admin Dashboard 
 * using real SQL queries.
 */
export async function fetchDashboardOverviewData() {
    try {
        // --- 3.1. KEY METRICS QUERY (Single, efficient query) ---
        const metricsSql = `
            SELECT
                -- 1. Total Revenue (from Payment table)
                (SELECT COALESCE(SUM(amount), 0) FROM Payment) AS totalRevenue,
                -- 2. Total Bookings
                (SELECT COUNT(booking_id) FROM Booking) AS totalBookings,
                -- 3. Active Givers (Givers that are verified)
                (SELECT COUNT(giver_id) FROM Service_Giver WHERE is_verified = TRUE) AS activeGivers,
                -- 4. New Clients (30 Days)
                (SELECT COUNT(client_id) FROM Client WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) AS newClientsLast30Days;
        `;
        const metricsResult = await executeSql(metricsSql);
        const keyMetrics = metricsResult[0];


        // --- 3.2. MONTHLY REVENUE TREND (Last 6 Months) ---
        const monthlyRevenueSql = `
            SELECT 
                DATE_FORMAT(P.created_at, '%b') AS month, -- e.g., 'Jan', 'Feb'
                COALESCE(SUM(P.amount), 0) AS revenue
            FROM 
                Payment P
            WHERE 
                P.created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
            GROUP BY 
                month
            ORDER BY 
                MIN(P.created_at) ASC;
        `;
        const monthlyRevenueData = await executeSql(monthlyRevenueSql);

        // --- 3.3. GIVER STATUS DISTRIBUTION (Based on is_verified) ---
        const giverStatusSql = `
            SELECT
                CASE
                    WHEN is_verified = TRUE THEN 'Active/Verified'
                    ELSE 'Pending/Unverified'
                END AS status,
                COUNT(giver_id) AS count
            FROM
                Service_Giver
            GROUP BY
                status;
        `;
        const rawGiverStatusData = await executeSql(giverStatusSql);
        
        // Map data to include the necessary color for the PieChart
        const giverStatusData = rawGiverStatusData.map(row => {
            const status = row.status;
            let fill = '#FBBF24'; // Default to Pending (Yellow)
            if (status.includes('Active')) {
                fill = '#34D399'; // Green
            }
            return { status: status.split('/')[0], count: row.count, fill };
        });

        // --- 3.4. TOP SERVICES BY BOOKING COUNT (Top 5) ---
        const serviceUsageSql = `
            SELECT 
                ST.service_name AS service,
                COUNT(B.booking_id) AS bookings
            FROM
                Booking B
            JOIN 
                Service_Type ST ON B.service_id = ST.service_id
            GROUP BY
                ST.service_name
            ORDER BY
                bookings DESC
            LIMIT 5;
        `;
        const serviceUsageData = await executeSql(serviceUsageSql);
        
        console.log("[DB SUCCESS] Dashboard data fetched (REAL DATA).");
        
        return {
            keyMetrics,
            monthlyRevenueData,
            giverStatusData,
            serviceUsageData,
        };
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        throw new Error("Could not fetch dashboard data from the database.");
    }
}

// -------------------------------------------------------------------
// 4. ADMIN: MANAGE GIVERS DATA 
// -------------------------------------------------------------------

/**
 * Fetches a list of all Service Givers with their basic profile status for the Admin page.
 */
export async function fetchGivers() {
    const sql = `
        SELECT
            g.giver_id AS id,
            g.email,
            g.is_verified,
            g.created_at,
            COALESCE(p.city, 'Unknown') AS city,
            COALESCE(p.bio, '') AS bio,
            COALESCE(p.avg_rating, 0.0) AS avg_rating,
            CASE 
                WHEN g.is_verified = 1 THEN 'Active'
                WHEN g.is_verified = 0 THEN 'Pending'
                ELSE 'Suspended'
            END AS status,
            (
                SELECT GROUP_CONCAT(DISTINCT st.service_name SEPARATOR ', ')
                FROM giver_service_price gsp2
                JOIN service_type st ON gsp2.service_id = st.service_id
                WHERE gsp2.giver_id = g.giver_id
            ) AS service -- 🟢 use singular to match frontend
        FROM service_giver g
        LEFT JOIN profile p ON g.giver_id = p.giver_id
        ORDER BY g.created_at DESC;
    `;

    try {
        const givers = await executeSql(sql);
        console.log(`[DB SUCCESS] Fetched ${givers.length} givers (merged services).`);
        return givers.map(giver => ({
            ...giver,
            name: giver.email.split('@')[0].replace('.', ' '), // 🟢 simple fallback "name"
            is_verified: !!giver.is_verified,
            service: giver.service || 'Unassigned'
        }));
    } catch (error) {
        console.error("[DB Query Error] FetchGivers:", error);
        throw new Error("Database query failed.");
    }
}




/**
 * 💥 NEW EXPORT: Updates the is_verified status for a specific Service Giver.
 * @param {number} giverId - The ID of the Service_Giver to update.
 * @param {boolean} isVerified - The new status (true for Active, false for Pending).
 * @returns {Promise<boolean>} True if one row was changed.
 */
export async function updateGiverStatus(giverId, isVerified) {
    const sql = `
        UPDATE Service_Giver 
        SET is_verified = ? 
        WHERE giver_id = ?;
    `;
    // MySQL2 results for UPDATE queries have an 'affectedRows' property
    const result = await executeSql(sql, [isVerified, giverId]);
    
    // Check if exactly one row was updated
    if (result && result.affectedRows === 1) {
        console.log(`[DB SUCCESS] Updated Service Giver ID ${giverId}. New status: ${isVerified ? 'VERIFIED' : 'PENDING'}.`);
        return true;
    } else {
        console.warn(`[DB WARNING] Service Giver ID ${giverId} not found or status already set.`);
        return false;
    }
}

// -------------------------------------------------------------------
// 5. ADMIN: SYSTEM SETTINGS
// -------------------------------------------------------------------

/**
 * Retrieves all system settings from the System_Setting table.
 * @returns {Promise<object>} An object of setting_key: setting_value pairs.
 */
export async function getSystemSettings() {
    try {
        const rows = await executeSql('SELECT setting_key, setting_value FROM System_Setting;');
        
        // Convert the array of {key, value} objects into a single settings object
        return rows.reduce((acc, row) => {
            acc[row.setting_key] = row.setting_value;
            return acc;
        }, {});
    } catch (error) {
        console.error("Error fetching system settings:", error);
        throw new Error("Could not fetch system settings from the database.");
    }
}

/**
 * Updates a batch of system settings using an UPSERT strategy 
 * (INSERT...ON DUPLICATE KEY UPDATE) on the System_Setting table.
 * @param {object} settings - An object of setting_key: setting_value pairs to update.
 * @returns {Promise<boolean>} True if the update was successful.
 */
export async function updateSystemSettings(settings) {
    if (Object.keys(settings).length === 0) {
        return true; // Nothing to update
    }

    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        for (const [key, value] of Object.entries(settings)) {
            const sql = `
                INSERT INTO System_Setting (setting_key, setting_value) 
                VALUES (?, ?) 
                ON DUPLICATE KEY UPDATE setting_value = ?;
            `;
            // Execute the UPSERT statement
            await connection.query(sql, [key, value, value]);
        }

        await connection.commit();
        console.log(`[DB SUCCESS] Updated ${Object.keys(settings).length} system settings.`);
        return true;

    } catch (error) {
        await connection.rollback();
        console.error("Error updating system settings (transaction rolled back):", error);
        throw new Error("Could not save system settings to the database.");
    } finally {
        // Must release the connection back to the pool
        connection.release();
    }
}



// -------------------------------------------------------------------
//  PLATFORM USAGE DATA (compliant with ONLY_FULL_GROUP_BY)
// -------------------------------------------------------------------
export async function fetchUsageData(months = 12) {
    try {
        // --- 1. Monthly Revenue ---
        const revenueSql = `
            SELECT 
                DATE_FORMAT(MIN(P.created_at), '%b %Y') AS month,
                COALESCE(SUM(P.amount), 0) AS revenue
            FROM Payment P
            WHERE P.created_at >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
            GROUP BY YEAR(P.created_at), MONTH(P.created_at)
            ORDER BY YEAR(P.created_at), MONTH(P.created_at);
        `;
        const revenue = await executeSql(revenueSql, [months]);

        // --- 2. Monthly Bookings ---
        const bookingSql = `
            SELECT 
                DATE_FORMAT(MIN(B.created_at), '%b %Y') AS month,
                COUNT(B.booking_id) AS bookings
            FROM Booking B
            WHERE B.created_at >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
            GROUP BY YEAR(B.created_at), MONTH(B.created_at)
            ORDER BY YEAR(B.created_at), MONTH(B.created_at);
        `;
        const bookings = await executeSql(bookingSql, [months]);

        // --- 3. Monthly New Clients ---
        const clientsSql = `
            SELECT 
                DATE_FORMAT(MIN(C.created_at), '%b %Y') AS month,
                COUNT(C.client_id) AS newClients
            FROM Client C
            WHERE C.created_at >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
            GROUP BY YEAR(C.created_at), MONTH(C.created_at)
            ORDER BY YEAR(C.created_at), MONTH(C.created_at);
        `;
        const clients = await executeSql(clientsSql, [months]);

        // --- Merge datasets ---
        const map = new Map();

        const merge = (rows, keyName) => {
            rows.forEach(r => {
                const m = r.month;
                const item = map.get(m) || { month: m, revenue: 0, bookings: 0, newClients: 0 };
                item[keyName] = Number(r[keyName]) || 0;
                map.set(m, item);
            });
        };

        merge(revenue, 'revenue');
        merge(bookings, 'bookings');
        merge(clients, 'newClients');

        // Sort months chronologically
        const result = Array.from(map.values()).sort((a, b) => {
            const d1 = new Date(a.month);
            const d2 = new Date(b.month);
            return d1 - d2;
        });

        console.log(`[DB SUCCESS] Fetched usage data (${result.length} months)`);
        return result;

    } catch (error) {
        console.error('Error fetching usage data:', error);
        throw new Error('Database query failed.');
    }
}

// --- SERVICES DATABASE FUNCTIONS ---

export async function fetchServices() {
  const sql = `
      SELECT 
        st.service_id AS id,
        st.service_name AS name,
        CONCAT('Category: ', sc.category_name) AS description,
        CASE WHEN st.base_unit IS NOT NULL THEN 1 ELSE 0 END AS active
      FROM service_type st
      LEFT JOIN service_category sc ON st.category_id = sc.category_id
      ORDER BY st.service_id DESC;
  `;
  try {
    return await executeSql(sql);
  } catch (error) {
    console.error("[DB Query Error] fetchServices:", error);
    throw new Error("Database query failed.");
  }
}

export async function addService({ name, description, active }) {
  const sql = `
      INSERT INTO service_type (category_id, service_name, base_unit)
      VALUES (1, ?, ?);
  `;
  try {
    const result = await executeSql(sql, [name, active ? "Project" : "Hour"]);
    return { id: result.insertId, name, description, active };
  } catch (error) {
    console.error("[DB Query Error] addService:", error);
    throw new Error("Failed to add service.");
  }
}

export async function updateService(id, { name, description, active }) {
  const sql = `
      UPDATE service_type 
      SET service_name = ?, base_unit = ?
      WHERE service_id = ?;
  `;
  try {
    await executeSql(sql, [name, active ? "Project" : "Hour", id]);
    return { id, name, description, active };
  } catch (error) {
    console.error("[DB Query Error] updateService:", error);
    throw new Error("Failed to update service.");
  }
}

export async function deleteService(id) {
  const sql = `DELETE FROM service_type WHERE service_id = ?;`;
  try {
    await executeSql(sql, [id]);
    return true;
  } catch (error) {
    console.error("[DB Query Error] deleteService:", error);
    throw new Error("Failed to delete service.");
  }
}

// --- GET SINGLE GIVER DETAILS ---
export async function fetchGiverDetails(giverId) {
  const sql = `
    SELECT 
      sg.giver_id AS id,
      sg.name,
      sg.email,
      sg.is_verified,
      sg.created_at,
      p.bio,
      p.city,
      p.phone,
      p.avg_rating,
      p.status AS profile_status,
      GROUP_CONCAT(DISTINCT st.service_name SEPARATOR ', ') AS services,
      COUNT(DISTINCT b.booking_id) AS total_bookings,
      COALESCE(SUM(pay.amount), 0) AS total_earned
    FROM service_giver sg
    LEFT JOIN profile p ON sg.giver_id = p.giver_id
    LEFT JOIN giver_service_price gsp ON sg.giver_id = gsp.giver_id
    LEFT JOIN service_type st ON gsp.service_id = st.service_id
    LEFT JOIN booking b ON sg.giver_id = b.giver_id
    LEFT JOIN payment pay ON b.booking_id = pay.booking_id
    WHERE sg.giver_id = ?
    GROUP BY sg.giver_id;
  `;

  try {
    const rows = await executeSql(sql, [giverId]);
    if (rows.length === 0) return null;

    const g = rows[0];

    return {
      id: g.id,
      name: g.name,
      email: g.email,
      city: g.city,
      phone: g.phone,
      bio: g.bio || "No biography provided.",
      services: g.services ? g.services.split(", ") : [],
      status: g.profile_status || (g.is_verified ? "Active" : "Pending"),
      joined: g.created_at,
      rating: g.avg_rating || 0,
      totalBookings: g.total_bookings || 0,
      totalEarnings: g.total_earned || 0,
      documents: ["ID Verification.pdf", "Portfolio Reference.docx"], // optional mock for now
    };
  } catch (error) {
    console.error("[DB Query Error] fetchGiverDetails:", error);
    throw new Error("Could not fetch giver details.");
  }
}


// ✅ DYNAMIC CLIENT DASHBOARD DATA
export async function fetchClientDashboardData(clientId) {
  try {
    // --- CLIENT PROFILE ---
    const clientSql = `
      SELECT client_id AS id, full_name AS name, email, created_at
      FROM Client
      WHERE client_id = ?;
    `;
    const [client] = await executeSql(clientSql, [clientId]);
    if (!client) throw new Error("Client not found");

    // --- STATS ---
    const statsSql = `
      SELECT 
        COUNT(*) AS total_bookings,
        SUM(CASE WHEN status = 'Completed' THEN 1 ELSE 0 END) AS completed,
        SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) AS pending
      FROM Booking
      WHERE client_id = ?;
    `;
    const [stats] = await executeSql(statsSql, [clientId]);

    // --- SPENDING ---
    const spendSql = `
      SELECT COALESCE(SUM(p.amount), 0) AS total_spent
      FROM Payment p
      JOIN Booking b ON p.booking_id = b.booking_id
      WHERE b.client_id = ?;
    `;
    const [spent] = await executeSql(spendSql, [clientId]);

    // --- RECENT BOOKINGS (last 5) ---
    const recentSql = `
      SELECT 
        b.booking_id,
        s.service_name,
        b.status,
        b.total_price_RWF,
        b.created_at
      FROM Booking b
      JOIN Service_Type s ON b.service_id = s.service_id
      WHERE b.client_id = ?
      ORDER BY b.created_at DESC
      LIMIT 5;
    `;
    const recentBookings = await executeSql(recentSql, [clientId]);

    return {
      profile: {
        id: client.id,
        name: client.name,
        email: client.email,
        joined: client.created_at,
        total_bookings: stats.total_bookings || 0,
        completed: stats.completed || 0,
        pending: stats.pending || 0,
        total_spent: spent.total_spent || 0,
      },
      recentBookings,
    };
  } catch (error) {
    console.error("[DB] fetchClientDashboardData error:", error);
    throw error;
  }
}

// ============================================================
// FETCH ALL CLIENT BOOKINGS
// ============================================================
export async function fetchClientBookings(clientId) {
  try {
    const sql = `
      SELECT 
        b.booking_id,
        s.service_name,
        sg.email AS giver_email,
        p.amount AS payment_amount,
        b.status,
        b.start_date,
        b.end_date,
        b.total_price_RWF,
        b.created_at
      FROM Booking b
      JOIN Service_Type s ON b.service_id = s.service_id
      JOIN Service_Giver sg ON b.giver_id = sg.giver_id
      LEFT JOIN Payment p ON b.booking_id = p.booking_id
      WHERE b.client_id = ?
      ORDER BY b.created_at DESC;
    `;

    const rows = await executeSql(sql, [clientId]);
    return rows;
  } catch (error) {
    console.error("[DB] fetchClientBookings error:", error);
    throw error;
  }
}


// ------------------------------------------------------------------
// FETCH BOOKING DETAILS (for client dashboard / booking details page)
// ------------------------------------------------------------------
export async function fetchBookingDetails(bookingId) {
  const sql = `
    SELECT 
      b.booking_id,
      b.client_id,
      b.giver_id,
      b.service_id,
      b.start_date,
      b.end_date,
      b.status,
      b.total_price_RWF,
      b.created_at,
      s.service_name,
      sg.email AS giver_email,
      sg.name AS giver_name,
      c.full_name AS client_name,
      COALESCE(p.city, 'N/A') AS city,
      CAST(COALESCE(p.avg_rating, 0) AS DECIMAL(2,1)) AS giver_rating,
      COALESCE(p.bio, '') AS giver_bio
    FROM booking b
    JOIN service_type s ON b.service_id = s.service_id
    JOIN service_giver sg ON b.giver_id = sg.giver_id
    JOIN client c ON b.client_id = c.client_id
    LEFT JOIN profile p ON sg.giver_id = p.giver_id
    WHERE b.booking_id = ?
    LIMIT 1;
  `;

  const rows = await executeSql(sql, [bookingId]);
  return rows.length > 0 ? rows[0] : null;
}

// ------------------------------------------------------------------
// SUBMIT REVIEW (1 per completed booking)
// ------------------------------------------------------------------
export async function submitReview(booking_id, giver_id, client_id, rating, comment) {
  // 1️⃣ Validate the booking first
  const [booking] = await executeSql(
    "SELECT status FROM booking WHERE booking_id = ? AND client_id = ?",
    [booking_id, client_id]
  );
  if (!booking) throw new Error("Invalid booking or unauthorized client.");
  if (booking.status !== "Completed") {
    throw new Error("You can only review completed bookings.");
  }

  // 2️⃣ Prevent duplicate review
  const existing = await executeSql(
    "SELECT review_id FROM review WHERE booking_id = ? AND client_id = ?",
    [booking_id, client_id]
  );
  if (existing.length > 0) {
    throw new Error("You have already reviewed this booking.");
  }

  // 3️⃣ Insert the review
  await executeSql(
    `INSERT INTO review (booking_id, giver_id, client_id, rating, comment)
     VALUES (?, ?, ?, ?, ?)`,
    [booking_id, giver_id, client_id, rating, comment]
  );

  // 4️⃣ Update giver’s average rating in profile table
  await executeSql(
    `UPDATE profile
     SET avg_rating = (
       SELECT ROUND(AVG(r.rating), 1)
       FROM review r
       WHERE r.giver_id = profile.giver_id
     )
     WHERE giver_id = ?`,
    [giver_id]
  );
}
export async function fetchBookingReview(bookingId) {
  const sql = `
    SELECT 
      r.review_id,
      r.rating,
      r.comment,
      r.created_at,
      c.full_name AS client_name
    FROM review r
    JOIN client c ON r.client_id = c.client_id
    WHERE r.booking_id = ?
    LIMIT 1;
  `;
  const rows = await executeSql(sql, [bookingId]);
  return rows.length > 0 ? rows[0] : null;
}

export async function fetchBookingWithReview(bookingId) {
  const sql = `
    SELECT 
      b.booking_id,
      b.client_id,
      b.giver_id,
      b.service_id,
      b.start_date,
      b.end_date,
      b.status,
      b.total_price_RWF,
      b.created_at,
      s.service_name,
      sg.email AS giver_email,
      sg.name AS giver_name,
      c.full_name AS client_name,
      COALESCE(p.city, 'N/A') AS city,
      CAST(COALESCE(p.avg_rating, 0) AS DECIMAL(2,1)) AS giver_rating,
      COALESCE(p.bio, '') AS giver_bio,
      r.review_id,
      r.rating AS review_rating,
      r.comment AS review_comment,
      r.created_at AS review_date
    FROM booking b
    JOIN service_type s ON b.service_id = s.service_id
    JOIN service_giver sg ON b.giver_id = sg.giver_id
    JOIN client c ON b.client_id = c.client_id
    LEFT JOIN profile p ON sg.giver_id = p.giver_id
    LEFT JOIN review r ON b.booking_id = r.booking_id
    WHERE b.booking_id = ?
    LIMIT 1;
  `;

  const rows = await executeSql(sql, [bookingId]);
  return rows.length > 0 ? rows[0] : null;
}

export async function fetchReviewByBooking(bookingId) {
  const sql = `
    SELECT 
      r.review_id,
      r.booking_id,
      r.giver_id,
      r.client_id,
      r.rating,
      r.comment,
      r.created_at,
      c.full_name AS client_name
    FROM review r
    JOIN client c ON r.client_id = c.client_id
    WHERE r.booking_id = ?
    LIMIT 1;
  `;
  const rows = await executeSql(sql, [bookingId]);
  return rows.length > 0 ? rows[0] : null;
}

// ✅ Add a new review
export async function addReview({ booking_id, giver_id, client_id, rating, comment }) {
  const sql = `
    INSERT INTO review (booking_id, giver_id, client_id, rating, comment, created_at)
    VALUES (?, ?, ?, ?, ?, NOW());
  `;
  const result = await executeSql(sql, [booking_id, giver_id, client_id, rating, comment]);
  return { review_id: result.insertId, booking_id, giver_id, client_id, rating, comment };
}

// ✅ Update an existing review
export async function updateReview(reviewId, rating, comment) {
  const sql = `
    UPDATE review
    SET rating = ?, comment = ?, created_at = NOW()
    WHERE review_id = ?;
  `;
  await executeSql(sql, [rating, comment, reviewId]);
  const fetchSql = `SELECT * FROM review WHERE review_id = ?;`;
  const rows = await executeSql(fetchSql, [reviewId]);
  return rows.length > 0 ? rows[0] : null;
}

export async function fetchGiverDashboard(giverId) {
  // 1️⃣ Profile info
  const [profile] = await executeSql(
    `SELECT 
        sg.name,
        sg.email,
        sg.is_verified,
        sg.created_at,
        COALESCE(p.avg_rating, 0) AS avg_rating
     FROM service_giver sg
     LEFT JOIN profile p ON sg.giver_id = p.giver_id
     WHERE sg.giver_id = ?`,
    [giverId]
  );

  // 2️⃣ Stats — earnings now based on bookings
  const [stats] = await executeSql(
    `SELECT 
        COUNT(DISTINCT gsp.service_id) AS active_services,
        COUNT(DISTINCT b.client_id) AS total_clients,
        COALESCE(SUM(CASE WHEN b.status = 'Completed' THEN b.total_price_RWF ELSE 0 END), 0) AS total_earnings
     FROM service_giver sg
     LEFT JOIN booking b ON sg.giver_id = b.giver_id
     LEFT JOIN giver_service_price gsp ON sg.giver_id = gsp.giver_id
     WHERE sg.giver_id = ?`,
    [giverId]
  );

  // 3️⃣ Recent bookings (for chart/list)
  const recentBookings = await executeSql(
    `SELECT 
        b.booking_id,
        c.full_name AS client_name,
        st.service_name,
        b.status,
        b.total_price_RWF,
        b.created_at
     FROM booking b
     JOIN client c ON b.client_id = c.client_id
     JOIN service_type st ON b.service_id = st.service_id
     WHERE b.giver_id = ?
     ORDER BY b.created_at DESC
     LIMIT 6`,
    [giverId]
  );

  return { profile, stats, recentBookings };
}




export async function updateGiverServicePrice(giverId, serviceId, price) {
  return await executeSql(
    `UPDATE giver_service_price 
     SET price_RWF = ? 
     WHERE giver_id = ? AND service_id = ?`,
    [price, giverId, serviceId]
  );
}

export async function fetchGiverServices(giverId) {
  return await executeSql(
    `SELECT 
        st.service_id,
        st.service_name,
        st.base_unit,
        gsp.price_RWF,
        gsp.is_active
     FROM giver_service_price gsp
     JOIN service_type st ON gsp.service_id = st.service_id
     WHERE gsp.giver_id = ?`,
    [giverId]
  );
}

export async function updateGiverServiceVisibility(giverId, serviceId, isActive) {
  return await executeSql(
    `UPDATE giver_service_price
     SET is_active = ?
     WHERE giver_id = ? AND service_id = ?`,
    [isActive, giverId, serviceId]
  );
}

export async function fetchGiverEarnings(giverId) {
  return await executeSql(
    `SELECT 
        DATE_FORMAT(b.created_at, '%Y-%m') AS month,
        COALESCE(SUM(b.total_price_RWF), 0) AS total_earnings
     FROM booking b
     WHERE b.giver_id = ? AND b.status = 'Completed'
     GROUP BY month
     ORDER BY month ASC;`,
    [giverId]
  );
}

export async function fetchActiveGiversWithServices(filters = {}) {
  const { category, minRating, verifiedOnly, minPrice, maxPrice, keyword } = filters;

  let sql = `
    SELECT 
      sg.giver_id,
      ANY_VALUE(sg.name) AS giver_name,
      ANY_VALUE(sg.email) AS email,
      ANY_VALUE(sg.is_verified) AS is_verified,
      ANY_VALUE(p.city) AS city,
      ANY_VALUE(p.bio) AS bio,
      ANY_VALUE(p.avg_rating) AS avg_rating,
      ANY_VALUE(p.hourly_rate_RWF) AS hourly_rate_RWF,
      ANY_VALUE(st.service_name) AS service_name,
      ANY_VALUE(gsp.price_RWF) AS price_RWF,
      COUNT(b.booking_id) AS total_bookings
    FROM service_giver sg
    LEFT JOIN profile p ON sg.giver_id = p.giver_id
    LEFT JOIN giver_service_price gsp ON sg.giver_id = gsp.giver_id
    LEFT JOIN service_type st ON gsp.service_id = st.service_id
    LEFT JOIN booking b ON sg.giver_id = b.giver_id
    WHERE 1=1
  `;

  const params = [];

  // ✅ Keyword search
  if (keyword) {
    sql += `
      AND (
        sg.name LIKE ? OR
        sg.email LIKE ? OR
        p.bio LIKE ? OR
        st.service_name LIKE ?
      )
    `;
    const kw = `%${keyword}%`;
    params.push(kw, kw, kw, kw);
  }

  if (category) {
    sql += " AND st.category_id = ?";
    params.push(category);
  }

  if (minRating) {
    sql += " AND COALESCE(p.avg_rating, 0) >= ?";
    params.push(minRating);
  }

  if (verifiedOnly) {
    sql += " AND sg.is_verified = 1";
  }

  if (minPrice && maxPrice) {
    sql += " AND COALESCE(gsp.price_RWF, 0) BETWEEN ? AND ?";
    params.push(minPrice, maxPrice);
  }

  sql += `
    GROUP BY sg.giver_id
    ORDER BY ANY_VALUE(p.avg_rating) DESC;
  `;

  try {
    const rows = await executeSql(sql, params);
    return rows;
  } catch (err) {
    console.error("[DB ERROR - fetchActiveGiversWithServices]", err.message);
    throw new Error("Database query failed.");
  }
}
// 🧩 Fetch all portfolio items for a given giver
export async function fetchGiverPortfolio(giverId) {
  const sql = `
    SELECT portfolio_id, title, description, media_url, media_type, uploaded_at
    FROM giver_portfolio
    WHERE giver_id = ?
    ORDER BY uploaded_at DESC;
  `;
  return await executeSql(sql, [giverId]);
}

// 🧩 Add a new portfolio item (image/video)
export async function addGiverPortfolioItem(giverId, title, description, mediaUrl, mediaType = 'image') {
  const sql = `
    INSERT INTO giver_portfolio (giver_id, title, description, media_url, media_type)
    VALUES (?, ?, ?, ?, ?);
  `;
  const result = await executeSql(sql, [giverId, title, description, mediaUrl, mediaType]);
  return { id: result.insertId, giverId, title, description, mediaUrl, mediaType };
}





