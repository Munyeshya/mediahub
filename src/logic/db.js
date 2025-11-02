// src/logic/db.js (Unified Login Logic - Database Check)

/**
 * --- TEST CREDENTIALS (PLAINTEXT) ---
 * These are the assumed values stored in the database's 'password_hash' column for simulation.
 * Admin: admin@hub.com / adminpass
 * Client: client@hub.com / clientpass
 * Giver: giver@hub.com / giverpass
 * * In a real application, you MUST use bcrypt or a similar library to check
 * the plaintext password against a stored hash (password_hash).
 */

// NOTE: Ensure your database connection 'pool' is properly imported and available.

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
            return null; // Invalid role selected
    }

    const sql = `
        SELECT ${idColumn} AS id, password_hash
        FROM ${tableName}
        WHERE email = ?;
    `;

    try {
        // --- START OF DATABASE CHECK SIMULATION ---
        // REPLACE THIS BLOCK with your actual pool.query logic:
        // const [rows] = await pool.query(sql, [email]);
        
        let rows = [];
        // Simulating fetching a record from the database for the matching email and retrieving its stored password hash
        if (email === `admin@hub.com` && role === 'Admin' && password === 'adminpass') rows.push({ id: 1, password_hash: 'adminpass' });
        if (email === `client@hub.com` && role === 'Client' && password === 'clientpass') rows.push({ id: 101, password_hash: 'clientpass' });
        if (email === `giver@hub.com` && role === 'Giver' && password === 'giverpass') rows.push({ id: 201, password_hash: 'giverpass' });

        if (rows.length === 0) {
            console.log(`Login failed: ${role} not found or credentials incorrect for ${email}`);
            return null; 
        }

        const user = rows[0];
        
        // **REAL-WORLD LOGIC (using hash)**: const isMatch = await bcrypt.compare(password, user.password_hash);
        // **SIMULATION (using plaintext)**: Direct comparison against the "database value"
        const isMatch = (password === user.password_hash); 

        if (isMatch) {
            console.log(`${role} login successful: ID ${user.id}`);
            return { id: user.id, role: role };
        } else {
            console.log(`Login failed: Invalid password for ${email} (${role})`);
            return null;
        }

    } catch (error) {
        console.error(`Error during ${role} authentication:`, error.message);
        throw new Error("Authentication service error."); 
    }
}

export const logout = () => {
    // 1. Clear any stored authentication data
    localStorage.removeItem('userAuthToken'); 
    localStorage.removeItem('userRole'); 
    // You may also want to clear any in-memory state in a real app

    console.log("User logged out. Auth state cleared.");
    return true; // Indicate success
};