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
 */
export async function logout(userId, role) { // 💥 FUNCTION NAME IS NOW 'logout'
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
        // Key Metrics Query (Uses subqueries for efficient fetching)
        const keyMetricsQuery = `
            SELECT 
                (SELECT SUM(total_price_rwf) FROM Booking WHERE status = 'Completed') AS totalRevenue,
                (SELECT COUNT(booking_id) FROM Booking) AS totalBookings,
                (SELECT COUNT(giver_id) FROM Service_Giver WHERE is_verified = TRUE AND status = 'Active') AS activeGivers,
                (SELECT COUNT(client_id) FROM Client WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) AS newClientsLast30Days;
        `;
        const keyMetricsResult = await executeSql(keyMetricsQuery);
        const { totalRevenue, totalBookings, activeGivers, newClientsLast30Days } = keyMetricsResult[0] || {};


        // Monthly Revenue Trend Query
        const monthlyRevenueQuery = `
            SELECT DATE_FORMAT(booked_at, '%b') AS month, SUM(total_price_rwf) AS revenue 
            FROM Booking 
            WHERE status = 'Completed'
            GROUP BY month 
            ORDER BY MIN(booked_at) ASC;
        `;
        const monthlyRevenueData = await executeSql(monthlyRevenueQuery);


        // Giver Status Distribution Query
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


        // Top Services by Booking Count Query
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
            monthlyBookingsData: [], // Placeholder for monthly bookings data if not explicitly calculated above
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
 * @returns {Promise<Array<object>>} List of giver objects.
 */
export async function fetchGivers() { // 💥 NEW EXPORT
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
        // Ensure ratings are formatted to one decimal place for consistency
        return givers.map(giver => ({
            ...giver,
            averageRating: parseFloat(giver.averageRating).toFixed(1)
        }));
    } catch (error) {
        console.error("Error fetching givers:", error);
        throw new Error("Could not fetch the list of service givers.");
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