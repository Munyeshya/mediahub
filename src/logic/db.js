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

// src/logic/db.js

/**
 * Simulates fetching the list of Givers from the backend API.
 * In a real application, this would use fetch or Axios to call a protected endpoint.
 * @returns {Promise<Array>} A promise that resolves to an array of Giver objects.
 */
export async function fetchGivers() {
    // 💥 NOTE: Replace this mock implementation with your actual API call.
    
    // Example placeholder data structure (matching the previous component structure)
    const mockGiversData = [
        { id: 101, name: "Alice Murenzi", email: "alice@creative.com", service: "Videographer", status: "Pending", joined: "2024-09-15" },
        { id: 102, name: "Bob Rwanda Beats", email: "bob@beats.com", service: "Music Producer", status: "Active", joined: "2023-11-01" },
        { id: 103, name: "Clara Photos", email: "clara@photos.com", service: "Photographer", status: "Suspended", joined: "2024-01-20" },
        { id: 104, name: "David Designer", email: "david@design.com", service: "Graphic Designer", status: "Pending", joined: "2024-10-25" },
        { id: 105, name: "Emma Architect", email: "emma@archi.com", service: "3D Modeler", status: "Active", joined: "2024-05-10" },
    ];
    
    try {
        // --- REAL API CALL Placeholder ---
        // const response = await fetch('/api/admin/givers', { 
        //     method: 'GET',
        //     headers: {
        //         'Authorization': `Bearer ${localStorage.getItem('token')}` 
        //     }
        // });

        // if (!response.ok) {
        //     throw new Error('Failed to fetch givers list.');
        // }
        // const data = await response.json();
        // return data.givers; 
        
        // --- MOCK SIMULATION ---
        await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
        return mockGiversData;

    } catch (error) {
        console.error("Error fetching givers:", error);
        throw new Error("Could not connect to the backend server.");
    }
}

/**
 * Simulates updating a Giver's status.
 * @param {number} id - The ID of the giver to update.
 * @param {string} status - The new status ('Active' or 'Suspended').
 * @returns {Promise<boolean>} A promise that resolves to true on success.
 */
export async function updateGiverStatus(id, status) {
    // 💥 NOTE: Replace this mock implementation with your actual API call.
    try {
        // --- REAL API CALL Placeholder ---
        // const response = await fetch(`/api/admin/givers/${id}/status`, { 
        //     method: 'PUT',
        //     headers: { 'Content-Type': 'application/json', 'Authorization': ... },
        //     body: JSON.stringify({ status })
        // });
        
        // if (!response.ok) {
        //     throw new Error(`Failed to update status for ID ${id}.`);
        // }

        // --- MOCK SIMULATION ---
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        console.log(`[DB SUCCESS] Updated Giver ID ${id} to Status: ${status}`);
        return true; 
    } catch (error) {
        console.error("Error updating giver status:", error);
        throw new Error("Could not update status on the server.");
    }
}

// src/logic/db.js (Partial Update - Add Service Functions)

/**
 * Simulates fetching the list of Givers from the backend API.
 * (Existing function - no change)
 */
export async function fetchGivers() {
    // ... (content of fetchGivers remains the same)
}

/**
 * Simulates updating a Giver's status.
 * (Existing function - no change)
 */
export async function updateGiverStatus(id, status) {
    // ... (content of updateGiverStatus remains the same)
}


// -------------------------------------------------------------
// 💥 NEW: SERVICE MANAGEMENT FUNCTIONS
// -------------------------------------------------------------

/**
 * Simulates fetching the list of Services from the backend API.
 */
export async function fetchServices() {
    // 💥 NOTE: Replace this mock implementation with your actual API call: GET /api/admin/services
    const mockServicesData = [
        { id: 1, name: "Videographer", description: "All forms of video production, editing, and cinematography.", active: true },
        { id: 2, name: "Photographer", description: "Studio and event photography, retouching, and drone stills.", active: true },
        { id: 3, name: "Music Producer", description: "Beat making, mixing, and mastering for all genres.", active: true },
        { id: 4, name: "Graphic Designer", description: "Logo design, branding, and digital asset creation.", active: false },
    ];
    
    try {
        await new Promise(resolve => setTimeout(resolve, 1500)); 
        return mockServicesData;
    } catch (error) {
        console.error("Error fetching services:", error);
        throw new Error("Could not connect to the backend server to fetch services.");
    }
}

/**
 * Simulates adding a new service.
 */
export async function addService(newService) {
    // 💥 NOTE: Replace this mock implementation with your actual API call: POST /api/admin/services
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        const addedService = { ...newService, id: Math.floor(Math.random() * 1000) + 100 };
        console.log(`[DB SUCCESS] Added Service: ${addedService.name}`);
        return addedService;
    } catch (error) {
        console.error("Error adding service:", error);
        throw new Error("Could not add service to the server.");
    }
}

/**
 * Simulates updating an existing service.
 */
export async function updateService(updatedService) {
    // 💥 NOTE: Replace this mock implementation with your actual API call: PUT /api/admin/services/:id
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log(`[DB SUCCESS] Updated Service ID ${updatedService.id} to Name: ${updatedService.name}`);
        return updatedService;
    } catch (error) {
        console.error("Error updating service:", error);
        throw new Error("Could not update service on the server.");
    }
}

/**
 * Simulates deleting a service.
 */
export async function deleteService(id) {
    // 💥 NOTE: Replace this mock implementation with your actual API call: DELETE /api/admin/services/:id
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log(`[DB SUCCESS] Deleted Service ID ${id}`);
        return true;
    } catch (error) {
        console.error("Error deleting service:", error);
        throw new Error("Could not delete service from the server.");
    }
}