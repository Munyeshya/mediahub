// /server/db.js (The REAL database module - MySQL2 and bcryptjs are safe here)
import mysql from 'mysql2/promise'; 
import bcrypt from 'bcryptjs'; 
import dotenv from 'dotenv';

dotenv.config(); 

// -------------------------------------------------------------------
// 1. DATABASE CONNECTION SETUP
// -------------------------------------------------------------------

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT, // Use the configured port 3306
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

/**
 * Executes an SQL query against the database pool.
 */
async function executeSql(sql, params = []) {
    try {
        const [rows] = await pool.query(sql, params); 
        return rows; 
    } catch (error) {
        console.error(`[DB Query Error] SQL: ${sql.substring(0, 50)}...`, error);
        throw new Error("Database query failed.");
    }
}

// -------------------------------------------------------------------
// 2. AUTHENTICATION LOGIC
// -------------------------------------------------------------------

/**
 * Authenticates a user (Admin, Client, or Giver) against the database using real credentials.
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
            return null;
    }

    const sql = `SELECT ${idColumn} AS id, password_hash FROM ${tableName} WHERE email = ?`;
    
    try {
        const rows = await executeSql(sql, [email]); 

        if (rows.length === 0) {
            return null; // User not found
        }
        
        const { id, password_hash } = rows[0];

        // Perform the real password comparison using bcrypt
        const passwordMatch = await bcrypt.compare(password, password_hash);

        if (passwordMatch) {
            console.log(`[DB SUCCESS] User ${id} logged in as ${role}.`);
            return { id, role }; 
        } else {
            return null; // Password mismatch
        }

    } catch (error) {
        console.error('Error during authenticateLogin:', error);
        throw new Error("Authentication failed due to a server error.");
    }
}

// -------------------------------------------------------------------
// 3. ADMIN DASHBOARD DATA
// -------------------------------------------------------------------

/**
 * Fetches all real data required for the Admin Dashboard overview.
 */
export async function fetchDashboardOverviewData() {
    console.log("[DB QUERY] Fetching real dashboard overview data...");
    
    // Key Metrics Queries
    const [
        totalRevenueResult, 
        totalBookingsResult, 
        activeGiversResult, 
        newClientsResult
    ] = await Promise.all([
        // Total Revenue (From Bookings marked as paid)
        executeSql(`SELECT COALESCE(SUM(price), 0) AS total FROM Booking WHERE is_paid = TRUE`),
        // Total Bookings (All time)
        executeSql(`SELECT COUNT(booking_id) AS count FROM Booking`),
        // Active Givers (Givers who are verified)
        executeSql(`SELECT COUNT(giver_id) AS count FROM Service_Giver WHERE is_verified = TRUE`),
        // New Clients (Last 30 days)
        executeSql(`SELECT COUNT(client_id) AS count FROM Client WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)`),
    ]);

    const keyMetrics = {
        totalRevenue: totalRevenueResult[0].total,
        totalBookings: totalBookingsResult[0].count,
        activeGivers: activeGiversResult[0].count,
        newClientsLast30Days: newClientsResult[0].count,
    };
    
    // Monthly Revenue Data (Last 6 months)
    const monthlyRevenueRaw = await executeSql(`
        SELECT 
            DATE_FORMAT(created_at, '%Y-%m') AS month, 
            COALESCE(SUM(price), 0) AS revenue
        FROM Booking
        WHERE is_paid = TRUE AND created_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY month
        ORDER BY month;
    `);
    
    // Convert to expected format for the chart (e.g., '2024-10' to 'Oct')
    const monthlyRevenueData = monthlyRevenueRaw.map(row => ({
        month: new Date(row.month).toLocaleDateString('en-US', { month: 'short' }),
        revenue: parseInt(row.revenue),
    }));

    // Giver Status Distribution (Verified vs. Unverified/Pending)
    const giverStatusRaw = await executeSql(`
        SELECT 
            CASE 
                WHEN is_verified = TRUE THEN 'Active'
                ELSE 'Pending'
            END AS status,
            COUNT(giver_id) AS count
        FROM Service_Giver
        GROUP BY status;
    `);

    // Map status strings to a consistent color code for the chart
    const giverStatusData = giverStatusRaw.map(row => ({
        status: row.status,
        count: row.count,
        fill: row.status === 'Active' ? '#34D399' : '#FBBF24',
    }));


    // Top 5 Services by Booking Count
    const serviceUsageData = await executeSql(`
        SELECT 
            T.service_name AS service, 
            COUNT(B.booking_id) AS bookings
        FROM Booking B
        JOIN Service_Type T ON B.service_id = T.service_id
        GROUP BY T.service_name
        ORDER BY bookings DESC
        LIMIT 5;
    `);

    return {
        keyMetrics,
        monthlyRevenueData,
        giverStatusData,
        serviceUsageData,
    };
}


// -------------------------------------------------------------------
// 4. SYSTEM SETTINGS LOGIC
// -------------------------------------------------------------------

/**
 * Retrieves all key-value pairs from the System_Setting table.
 */
export async function getSystemSettings() {
    try {
        // NOTE: Assumes System_Setting table exists as per previous plan
        const rows = await executeSql('SELECT setting_key, setting_value FROM System_Setting;');
        
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
 * Updates a batch of system settings using an UPSERT strategy.
 */
export async function updateSystemSettings(settings) {
    if (Object.keys(settings).length === 0) {
        return true; 
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
        connection.release();
    }
}