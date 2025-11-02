// src/logic/db.js

import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

// --- 1. Database Connection Setup ---

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection on startup
pool.getConnection()
    .then(connection => {
        console.log("✅ Successfully connected to MediaHub MySQL database.");
        connection.release();
    })
    .catch(err => {
        console.error("❌ Database connection failed:", err.message);
        // Important: Exit process if essential service fails
        process.exit(1); 
    });


// --- 2. Reusable Query Functions (Logic Layer) ---

/**
 * Executes a SELECT query to retrieve profiles based on filters.
 * @param {string} serviceName - The service name (e.g., 'Wedding Photography').
 * @param {number} minRating - The minimum required rating.
 * @param {number} minPrice - The minimum hourly rate.
 * @returns {Promise<Array>} A list of matching creative profiles.
 */
export async function findCreativeServices({ serviceName, minRating, minPrice }) {
    // Basic SQL Query using JOINs to pull data from multiple tables
    const sql = `
        SELECT 
            p.profile_id, p.display_name, p.city, sg.is_verified, 
            gsp.hourly_rate_rwf, st.service_name, 
            AVG(r.rating) AS average_rating, COUNT(b.booking_id) AS total_bookings
        FROM 
            Profile p
        JOIN Service_Giver sg ON p.giver_id = sg.giver_id
        JOIN Giver_Service_Price gsp ON p.giver_id = gsp.giver_id
        JOIN Service_Type st ON gsp.service_id = st.service_id
        LEFT JOIN Review r ON p.giver_id = r.giver_id
        LEFT JOIN Booking b ON p.giver_id = b.giver_id AND b.status = 'Completed'
        WHERE 
            st.service_name = ?
            AND gsp.hourly_rate_rwf >= ?
        GROUP BY 
            p.profile_id
        HAVING 
            average_rating >= ? OR average_rating IS NULL
        ORDER BY 
            average_rating DESC
    `;

    // The query parameters replace the '?' placeholders securely
    const params = [serviceName, minPrice, minRating];

    try {
        const [rows] = await pool.query(sql, params);
        return rows;
    } catch (error) {
        console.error("Error executing findCreativeServices query:", error.message);
        throw new Error("Failed to retrieve services from database.");
    }
}

// You can add other functions here (e.g., getClientBookings, createNewReview)
// export async function getServiceCategories() { ... }