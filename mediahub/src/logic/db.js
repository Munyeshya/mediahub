// src/logic/db.js (Unified Database Logic - Real MySQL2 and bcrypt Implementation)
import mysql from 'mysql2/promise'; // Use the promise version for async/await
import bcrypt from 'bcrypt';
// NOTE: Environment variables (DB_HOST, DB_USER, etc.) must be set for this to work.

// -------------------------------------------------------------------
// 1. DATABASE CONNECTION SETUP
// -------------------------------------------------------------------

// Create a connection pool using environment variables
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, // Adjust as needed
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
        console.error(`[DB Query Error] SQL: ${sql.substring(0, 100)}...`, error);
        throw new Error("Database query failed.");
    }
}


// -------------------------------------------------------------------
// 2. AUTHENTICATION LOGIC (Real Queries & bcrypt)
// -------------------------------------------------------------------

/**
 * Authenticates a user (Admin, Client, or Giver) against the database.
 */
export async function authenticateLogin(email, password, role) {
    let tableName = '';
    let idColumn = '';
    
    switch (role) {
        case 'Admin': tableName = 'Admin'; idColumn = 'admin_id'; break;
        case 'Client': tableName = 'Client'; idColumn = 'client_id'; break;
        case 'Giver': tableName = 'Service_Giver'; idColumn = 'giver_id'; break;
        default: return null;
    }

    const sql = `SELECT ${idColumn} AS id, password_hash FROM ${tableName} WHERE email = ?`;
    
    try {
        const rows = await executeSql(sql, [email]);
        const user = rows[0];

        if (!user) {
            return null;
        }
        
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        
        if (passwordMatch) {
            return { id: user.id, role };
        }
        
        return null;

    } catch (error) {
        console.error("Authentication check failed:", error);
        return null;
    }
}

/**
 * Logs a user out.
 */
export async function logout(userId, role) {
    try {
        console.log(`[LOGOUT] User ID: ${userId} (Role: ${role}) successfully logged out.`);
        await new Promise(resolve => setTimeout(resolve, 100));
        return true;
    } catch (error) {
        console.error("Logout process error:", error);
        return false;
    }
}


// -------------------------------------------------------------------
// 3. ADMIN DASHBOARD DATA LOGIC
// -------------------------------------------------------------------

/**
 * Fetches all core dashboard overview data using real SQL queries.
 */
export async function fetchDashboardOverviewData() {
    try {
        // 1. Key Metrics Query
        const keyMetricsQuery = `
            SELECT 
                (SELECT SUM(total_price_rwf) FROM Booking WHERE status = 'Completed') AS totalRevenue,
                (SELECT COUNT(booking_id) FROM Booking) AS totalBookings,
                (SELECT COUNT(giver_id) FROM Service_Giver WHERE is_verified = TRUE AND status = 'Active') AS activeGivers,
                (SELECT COUNT(client_id) FROM Client WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) AS newClientsLast30Days;
        `;
        const keyMetricsResult = await executeSql(keyMetricsQuery);
        const { totalRevenue, totalBookings, activeGivers, newClientsLast30Days } = keyMetricsResult[0] || {};

        // 2. Monthly Revenue Trend Query
        const monthlyRevenueQuery = `
            SELECT DATE_FORMAT(booked_at, '%b') AS month, SUM(total_price_rwf) AS revenue 
            FROM Booking 
            WHERE status = 'Completed'
            GROUP BY month 
            ORDER BY MIN(booked_at) ASC;
        `;
        const monthlyRevenueData = await executeSql(monthlyRevenueQuery);

        // 3. Giver Status Distribution Query
        const giverStatusQuery = `
            SELECT status, COUNT(giver_id) as count 
            FROM Service_Giver 
            GROUP BY status;
        `;
        const rawGiverStatusData = await executeSql(giverStatusQuery);
        const giverStatusData = rawGiverStatusData.map(row => ({
            ...row,
            fill: row.status === 'Active' ? '#34D399' : (row.status === 'Pending' ? '#FBBF24' : '#EF4444')
        }));

        // 4. Top Services by Booking Count Query
        const serviceUsageQuery = `
            SELECT T.service_name as service, COUNT(B.booking_id) as bookings 
            FROM Booking B 
            JOIN Giver_Service_Price GSP ON B.gs_price_id = GSP.gs_price_id
            JOIN Service_Type T ON GSP.service_id = T.service_id
            WHERE B.status = 'Completed'
            GROUP BY T.service_name 
            ORDER BY bookings DESC 
            LIMIT 5;
        `;
        const serviceUsageData = await executeSql(serviceUsageQuery);

        return {
            keyMetrics: {
                totalRevenue: totalRevenue || 0,
                totalBookings: totalBookings || 0,
                activeGivers: activeGivers || 0,
                newClientsLast30Days: newClientsLast30Days || 0,
            },
            monthlyRevenueData,
            monthlyBookingsData: [], 
            giverStatusData,
            serviceUsageData,
        };
    } catch (error) {
        console.error("Error fetching dashboard overview data:", error);
        throw new Error("Could not retrieve dashboard data from the database.");
    }
}


// -------------------------------------------------------------------
// 4. ADMIN GIVER MANAGEMENT LOGIC
// -------------------------------------------------------------------

/**
 * Fetches a comprehensive list of all Service Givers for the admin panel.
 */
export async function fetchGivers() {
    const sql = `
        SELECT 
            SG.giver_id AS id,
            P.full_name AS fullName,
            SG.email,
            P.city,
            SG.is_verified AS isVerified,
            SG.status,
            (
                SELECT COUNT(booking_id) 
                FROM Booking 
                WHERE giver_id = SG.giver_id AND status = 'Completed'
            ) AS completedBookings,
            (
                SELECT COALESCE(AVG(rating), 0) 
                FROM Review 
                WHERE giver_id = SG.giver_id
            ) AS averageRating
        FROM Service_Giver SG
        LEFT JOIN Profile P ON SG.giver_id = P.giver_id
        ORDER BY SG.created_at DESC;
    `;
    try {
        const givers = await executeSql(sql);
        return givers.map(giver => ({
            ...giver,
            averageRating: parseFloat(giver.averageRating).toFixed(1)
        }));
    } catch (error) {
        console.error("Error fetching givers:", error);
        throw new Error("Could not fetch the list of service givers.");
    }
}

/**
 * Updates the status and verification flag for a Service Giver.
 */
export async function updateGiverStatus(giverId, status, isVerified) { 
    const sql = `
        UPDATE Service_Giver 
        SET status = ?, is_verified = ?
        WHERE giver_id = ?;
    `;
    try {
        const result = await executeSql(sql, [status, isVerified, giverId]);
        if (result.affectedRows === 0) {
            console.warn(`[DB WARN] Giver ID ${giverId} not found or no changes made.`);
        }
        return true;
    } catch (error) {
        console.error("Error updating giver status:", error);
        throw new Error("Could not update giver status on the database.");
    }
}


// -------------------------------------------------------------------
// 5. ADMIN SERVICE MANAGEMENT LOGIC
// -------------------------------------------------------------------

/**
 * Fetches all services with their category names for the admin panel.
 */
export async function fetchServices() {
    const sql = `
        SELECT 
            ST.service_id AS id, 
            ST.service_name AS name, 
            ST.base_unit AS baseUnit,
            SC.category_name AS categoryName,
            ST.category_id AS categoryId
        FROM Service_Type ST
        JOIN Service_Category SC ON ST.category_id = SC.category_id
        ORDER BY SC.category_name, ST.service_name;
    `;
    try {
        return await executeSql(sql);
    } catch (error) {
        console.error("Error fetching services:", error);
        throw new Error("Could not fetch service list.");
    }
}

/**
 * Adds a new service to the Service_Type table.
 */
export async function addService(newService) {
    const { name, categoryId, baseUnit } = newService;
    const sql = `
        INSERT INTO Service_Type (category_id, service_name, base_unit) 
        VALUES (?, ?, ?);
    `;
    try {
        const result = await executeSql(sql, [categoryId, name, baseUnit]);
        // NOTE: result.insertId is the correct way to get the new ID
        return { id: result.insertId, ...newService }; 
    } catch (error) {
        console.error("Error adding service:", error);
        throw new Error("Could not add service to the database. It might already exist.");
    }
}

/**
 * Updates an existing service's name, category ID, and base unit.
 */
export async function updateService(updatedService) {
    const { id, name, categoryId, baseUnit } = updatedService;
    const sql = `
        UPDATE Service_Type 
        SET service_name = ?, category_id = ?, base_unit = ?
        WHERE service_id = ?;
    `;
    try {
        await executeSql(sql, [name, categoryId, baseUnit, id]);
        return updatedService;
    } catch (error) {
        console.error("Error updating service:", error);
        throw new Error("Could not update service on the database.");
    }
}

/**
 * Deletes a service by its ID.
 */
export async function deleteService(id) {
    const sql = `
        DELETE FROM Service_Type 
        WHERE service_id = ?;
    `;
    try {
        const result = await executeSql(sql, [id]);
        if (result.affectedRows === 0) {
            throw new Error(`Service ID ${id} not found.`);
        }
        return true;
    } catch (error) {
        console.error("Error deleting service:", error);
        throw new Error("Could not delete service from the database. It may be linked to existing records.");
    }
}


// -------------------------------------------------------------------
// 6. ADMIN SYSTEM SETTINGS LOGIC 💥 NEW SECTION
// -------------------------------------------------------------------

/**
 * Fetches all system settings as an object of key-value pairs 
 * from the System_Setting table (assumed structure).
 * @returns {Promise<object>} The system settings.
 */
export async function getSystemSettings() { // 💥 NEW EXPORT
    const sql = `
        SELECT setting_key, setting_value 
        FROM System_Setting;
    `;
    try {
        const rows = await executeSql(sql);
        
        // Transform array of rows into a single key-value object
        const settings = rows.reduce((acc, row) => {
            acc[row.setting_key] = row.setting_value;
            return acc;
        }, {});
        
        // Provide defaults and merge with fetched settings
        return {
            platform_fee_percent: '10', 
            min_booking_price_rwf: '5000',
            max_cancellation_days: '3',
            ...settings
        };
    } catch (error) {
        // Handle case where the table might not exist yet
        if (error.message.includes("Unknown table")) {
            console.warn("System_Setting table not found. Returning default settings.");
            return {
                platform_fee_percent: '10', 
                min_booking_price_rwf: '5000',
                max_cancellation_days: '3'
            };
        }
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
export async function updateSystemSettings(settings) { // 💥 NEW EXPORT
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
        connection.release();
    }
}