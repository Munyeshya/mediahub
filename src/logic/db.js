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
        const [rows] = await pool.query(sql, params);
        return rows; // Rows is an array of objects
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
 * @param {string} email - The user's email.
 * @param {string} password - The plaintext password.
 * @param {string} role - The selected role ('Admin', 'Client', or 'Giver').
 * @returns {Promise<object|null>} Object {id, role} on successful login, or null on failure.
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

    // SQL: Fetch the ID and stored password hash for the given email
    const sql = `SELECT ${idColumn} AS id, password_hash FROM ${tableName} WHERE email = ?`;
    
    try {
        const rows = await executeSql(sql, [email]);
        const user = rows[0];

        if (!user) {
            return null; // User not found
        }
        
        // Use bcrypt to compare the submitted password with the stored hash
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        
        if (passwordMatch) {
            return { id: user.id, role };
        }
        
        return null; // Password mismatch

    } catch (error) {
        console.error("Authentication check failed:", error);
        return null;
    }
}

/**
 * Logs a user out. Renamed to 'logout' to match the import alias in auth.jsx.
 * @param {number} userId - The ID of the user logging out (optional, for logging).
 * @param {string} role - The role of the user (optional, for logging).
 * @returns {Promise<boolean>} Always returns true on success.
 */
export async function logout(userId, role) { // 💥 FUNCTION NAME IS NOW 'logout'
    // NOTE: In a token-based system, this is a server-side NO-OP.
    // The main work (deleting token/state) happens on the client (auth.jsx).
    
    try {
        // Log the action (no actual database change needed here)
        console.log(`[LOGOUT] User ID: ${userId} (Role: ${role}) successfully logged out.`);
        
        // Simulate a small network delay for consistency
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
        // 1. Key Metrics Query (Uses subqueries for efficient fetching in one call)
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


        // 3. Monthly Bookings Trend Query
        const monthlyBookingsQuery = `
            SELECT DATE_FORMAT(booked_at, '%b') AS month, COUNT(booking_id) AS bookings 
            FROM Booking 
            WHERE status = 'Completed'
            GROUP BY month 
            ORDER BY MIN(booked_at) ASC;
        `;
        const monthlyBookingsData = await executeSql(monthlyBookingsQuery);


        // 4. Giver Status Distribution Query
        const giverStatusQuery = `
            SELECT status, COUNT(giver_id) as count 
            FROM Service_Giver 
            GROUP BY status;
        `;
        // Map the results to include client-side colors
        const rawGiverStatusData = await executeSql(giverStatusQuery);
        const giverStatusData = rawGiverStatusData.map(row => ({
            ...row,
            fill: row.status === 'Active' ? '#34D399' : (row.status === 'Pending' ? '#FBBF24' : '#EF4444')
        }));


        // 5. Top Services by Booking Count Query
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

        // All results are combined and returned
        return {
            keyMetrics: {
                totalRevenue: totalRevenue || 0,
                totalBookings: totalBookings || 0,
                activeGivers: activeGivers || 0,
                newClientsLast30Days: newClientsLast30Days || 0,
            },
            monthlyRevenueData,
            monthlyBookingsData,
            giverStatusData,
            serviceUsageData,
        };
    } catch (error) {
        console.error("Error fetching dashboard overview data:", error);
        throw new Error("Could not retrieve dashboard data from the database.");
    }
}


// -------------------------------------------------------------------
// 4. ADMIN SERVICE MANAGEMENT LOGIC
// -------------------------------------------------------------------

/**
 * Fetches all services with their category names for the admin panel.
 */
export async function fetchServices() {
    // SQL: Joins Service_Type with Service_Category
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
    // SQL: INSERT INTO Service_Type
    const sql = `
        INSERT INTO Service_Type (category_id, service_name, base_unit) 
        VALUES (?, ?, ?);
    `;
    try {
        const result = await executeSql(sql, [categoryId, name, baseUnit]);
        // Return the full new service object with the newly created ID
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
    // SQL: UPDATE Service_Type
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
    // SQL: DELETE FROM Service_Type
    const sql = `
        DELETE FROM Service_Type 
        WHERE service_id = ?;
    `;
    try {
        const result = await executeSql(sql, [id]);
        // Check if a row was actually deleted
        if (result.affectedRows === 0) {
            throw new Error(`Service ID ${id} not found.`);
        }
        return true;
    } catch (error) {
        console.error("Error deleting service:", error);
        throw new Error("Could not delete service from the database. It may be linked to existing records.");
    }
}