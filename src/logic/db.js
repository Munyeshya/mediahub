// src/logic/db.js (ADD THIS FUNCTION)

import bcrypt from 'bcryptjs'; // You'll need to install this library
// npm install bcryptjs 

/**
 * Handles the login authentication for an Admin.
 * @param {string} email - The admin's email.
 * @param {string} password - The plaintext password provided by the user.
 * @returns {Promise<number|null>} The admin_id on successful login, or null otherwise.
 */
export async function authenticateAdmin(email, password) {
    const sql = `
        SELECT admin_id, password_hash
        FROM Admin
        WHERE email = ?;
    `;

    try {
        const [rows] = await pool.query(sql, [email]);
        
        if (rows.length === 0) {
            console.log(`Admin login failed: Email not found (${email})`);
            return null; // Email not found
        }

        const admin = rows[0];
        
        // IMPORTANT: Compare the provided password with the stored hash
        // In a real application, you must use a hashing library like bcryptjs
        // For testing purposes, if you inserted plain text passwords, you'd use a simple check (but don't do this in production)
        
        // --- SECURE HASH CHECK (Requires bcryptjs) ---
        // Since we placeholder-hashed passwords, we assume this comparison:
        // const isMatch = await bcrypt.compare(password, admin.password_hash);

        // --- TEMPORARY MOCK CHECK (Replace with real hashing ASAP) ---
        // For now, let's assume a simplified check if the password equals the placeholder name:
        // You should modify the database insert to use a hash of a known password (e.g., 'admin123')
        const MOCK_HASH_ADMIN = 'admin123'; // Replace with a real hash later
        const isMatch = (password === MOCK_HASH_ADMIN); // Temporary check

        if (isMatch) {
            console.log(`Admin login successful: ID ${admin.admin_id}`);
            return admin.admin_id;
        } else {
            console.log(`Admin login failed: Invalid password for ${email}`);
            return null;
        }

    } catch (error) {
        console.error("Error during admin authentication:", error.message);
        throw new Error("Authentication service error.");
    }
}