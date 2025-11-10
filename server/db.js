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
            sg.giver_id AS id,
            sg.email,
            sg.is_verified,
            sg.created_at,
            p.full_name,
            p.city
        FROM
            Service_Giver sg
        LEFT JOIN
            Profile p ON sg.giver_id = p.giver_id
        ORDER BY
            sg.created_at DESC;
    `;
    try {
        const givers = await executeSql(sql);
        console.log(`[DB SUCCESS] Fetched ${givers.length} service givers.`);
        // Note: is_verified is a number (0/1) from MySQL; convert to boolean for clarity.
        return givers.map(giver => ({
            ...giver,
            is_verified: !!giver.is_verified 
        }));
    } catch (error) {
        console.error("Error fetching givers list:", error);
        throw new Error("Could not fetch service givers from the database.");
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

// server/db.js (add near other exported functions)
export async function fetchUsageData(months = 12) {
  try {
    // 1) Revenue per month (last `months` months)
    const revenueSql = `
      SELECT DATE_FORMAT(P.created_at, '%b %Y') AS month,
             COALESCE(SUM(P.amount),0) AS revenue,
             MIN(P.created_at) as first_date_in_month
      FROM Payment P
      WHERE P.created_at >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
      GROUP BY YEAR(P.created_at), MONTH(P.created_at)
      ORDER BY YEAR(P.created_at), MONTH(P.created_at);
    `;
    const revenueRows = await executeSql(revenueSql, [months]);

    // 2) Bookings per month
    const bookingsSql = `
      SELECT DATE_FORMAT(created_at, '%b %Y') AS month,
             COUNT(booking_id) AS bookings
      FROM Booking
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
      GROUP BY YEAR(created_at), MONTH(created_at)
      ORDER BY YEAR(created_at), MONTH(created_at);
    `;
    const bookingRows = await executeSql(bookingsSql, [months]);

    // 3) New clients per month
    const clientsSql = `
      SELECT DATE_FORMAT(created_at, '%b %Y') AS month,
             COUNT(client_id) AS newClients
      FROM Client
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
      GROUP BY YEAR(created_at), MONTH(created_at)
      ORDER BY YEAR(created_at), MONTH(created_at);
    `;
    const clientRows = await executeSql(clientsSql, [months]);

    // Merge the three result sets by month (preserving chronological order)
    const mapByMonth = new Map();

    // Seed months from revenue (keeps chronological order). If some months miss revenue, bookings or clients will still be merged below.
    revenueRows.forEach(r => {
      mapByMonth.set(r.month, { month: r.month, revenue: Number(r.revenue) });
    });
    bookingRows.forEach(b => {
      const item = mapByMonth.get(b.month) || { month: b.month, revenue: 0 };
      item.bookings = Number(b.bookings);
      mapByMonth.set(b.month, item);
    });
    clientRows.forEach(c => {
      const item = mapByMonth.get(c.month) || { month: c.month, revenue: 0 };
      item.newClients = Number(c.newClients);
      mapByMonth.set(c.month, item);
    });

    // Convert to array and ensure months are in chronological order.
    // Use revenueRows + bookingRows + clientRows to collect months in chronological order if some arrays are empty.
    const monthsOrder = Array.from(new Set([
      ...revenueRows.map(r => r.month),
      ...bookingRows.map(b => b.month),
      ...clientRows.map(c => c.month),
    ]));

    const result = monthsOrder.map(m => {
      const it = mapByMonth.get(m) || { month: m, revenue: 0, bookings: 0, newClients: 0 };
      return {
        month: it.month,
        revenue: it.revenue || 0,
        bookings: it.bookings || 0,
        newClients: it.newClients || 0
      };
    });

    return result;
  } catch (error) {
    console.error("Error fetching usage data:", error);
    throw new Error("Could not fetch usage data.");
  }
}

// -------------------------------------------------------------------
//  PLATFORM USAGE DATA
// -------------------------------------------------------------------
export async function fetchUsageData(months = 12) {
    try {
        // monthly revenue
        const revenueSql = `
            SELECT DATE_FORMAT(P.created_at, '%b %Y') AS month, SUM(P.amount) AS revenue
            FROM Payment P
            WHERE P.created_at >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
            GROUP BY YEAR(P.created_at), MONTH(P.created_at)
            ORDER BY YEAR(P.created_at), MONTH(P.created_at);
        `;
        const revenue = await executeSql(revenueSql, [months]);

        // monthly bookings
        const bookingSql = `
            SELECT DATE_FORMAT(B.created_at, '%b %Y') AS month, COUNT(B.booking_id) AS bookings
            FROM Booking B
            WHERE B.created_at >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
            GROUP BY YEAR(B.created_at), MONTH(B.created_at)
            ORDER BY YEAR(B.created_at), MONTH(B.created_at);
        `;
        const bookings = await executeSql(bookingSql, [months]);

        // monthly new clients
        const clientsSql = `
            SELECT DATE_FORMAT(C.created_at, '%b %Y') AS month, COUNT(C.client_id) AS newClients
            FROM Client C
            WHERE C.created_at >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
            GROUP BY YEAR(C.created_at), MONTH(C.created_at)
            ORDER BY YEAR(C.created_at), MONTH(C.created_at);
        `;
        const clients = await executeSql(clientsSql, [months]);

        // Merge results
        const map = new Map();
        const merge = (rows, key, field) => {
            rows.forEach(r => {
                const m = r.month;
                const obj = map.get(m) || { month: m, revenue: 0, bookings: 0, newClients: 0 };
                obj[field] = Number(r[key] || 0);
                map.set(m, obj);
            });
        };
        merge(revenue, 'revenue', 'revenue');
        merge(bookings, 'bookings', 'bookings');
        merge(clients, 'newClients', 'newClients');

        return Array.from(map.values());
    } catch (err) {
        console.error("fetchUsageData error:", err);
        throw new Error("Could not fetch usage data");
    }
}
