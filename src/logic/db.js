// src/logic/db.js (Unified Database Logic)

// -------------------------------------------------------------------
// 1. AUTHENTICATION LOGIC
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

    // SQL placeholder: SELECT id_column AS id, password_hash FROM table_name WHERE email = ?;
    
    try {
        // --- START OF DATABASE CHECK SIMULATION (Admin: admin@hub.com/adminpass) ---
        let rows = [];
        if (email === `admin@hub.com` && role === 'Admin' && password === 'adminpass') rows.push({ id: 1, password_hash: 'adminpass' });
        if (email === `client@hub.com` && role === 'Client' && password === 'clientpass') rows.push({ id: 101, password_hash: 'clientpass' });
        if (email === `giver@hub.com` && role === 'Giver' && password === 'giverpass') rows.push({ id: 201, password_hash: 'giverpass' });

        if (rows.length === 0) {
            return null; 
        }

        const user = rows[0];
        const isMatch = (password === user.password_hash); // Simulation

        if (isMatch) {
            console.log(`${role} login successful: ID ${user.id}`);
            return { id: user.id, role: role };
        } else {
            return null;
        }

    } catch (error) {
        console.error(`Error during ${role} authentication:`, error.message);
        throw new Error("Authentication service error."); 
    }
}

export const logout = () => {
    localStorage.removeItem('userAuthToken'); 
    localStorage.removeItem('userRole'); 
    console.log("User logged out. Auth state cleared.");
    return true; 
};


// -------------------------------------------------------------------
// 2. GIVERS MANAGEMENT FUNCTIONS
// -------------------------------------------------------------------

/**
 * Simulates fetching the list of Givers from the backend API.
 */
export async function fetchGivers() {
    // 💥 NOTE: Replace this mock implementation with your actual API call.
    const mockGiversData = [
        { id: 101, name: "Alice Murenzi", email: "alice@creative.com", service: "Videographer", status: "Pending", joined: "2024-09-15" },
        { id: 102, name: "Bob Rwanda Beats", email: "bob@beats.com", service: "Music Producer", status: "Active", joined: "2023-11-01" },
        { id: 103, name: "Clara Photos", email: "clara@photos.com", service: "Photographer", status: "Suspended", joined: "2024-01-20" },
        { id: 104, name: "David Designer", email: "david@design.com", service: "Graphic Designer", status: "Pending", joined: "2024-10-25" },
        { id: 105, name: "Emma Architect", email: "emma@archi.com", service: "3D Modeler", status: "Active", joined: "2024-05-10" },
        { id: 106, name: "Fiona Film", email: "fiona@film.com", service: "Videographer", status: "Pending", joined: "2024-10-01" },
        { id: 107, name: "George Geo", email: "george@geo.com", service: "Photographer", status: "Active", joined: "2023-08-15" },
        { id: 108, name: "Hana Hues", email: "hana@hues.com", service: "Graphic Designer", status: "Active", joined: "2024-03-22" },
    ];
    
    try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        return mockGiversData;
    } catch (error) {
        console.error("Error fetching givers:", error);
        throw new Error("Could not connect to the backend server.");
    }
}

/**
 * Simulates updating a Giver's status.
 */
export async function updateGiverStatus(id, status) {
    // 💥 NOTE: Replace this mock implementation with your actual API call: PUT /api/admin/givers/:id/status
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        console.log(`[DB SUCCESS] Updated Giver ID ${id} to Status: ${status}`);
        return true; 
    } catch (error) {
        console.error("Error updating giver status:", error);
        throw new Error("Could not update status on the server.");
    }
}


// -------------------------------------------------------------------
// 3. SERVICE MANAGEMENT FUNCTIONS
// -------------------------------------------------------------------

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

// --- 5. SYSTEM SETTINGS LOGIC ---
// NOTE: In a real app, these would call endpoints like GET/PUT /api/admin/settings

// Mock storage for settings
let mockSystemSettings = {
    commissionRate: 0.15, // 15%
    minPayoutRWF: 50000,
    emailVerificationRequired: true,
    platformStatus: 'Operational',
};

/**
 * Simulates fetching global system settings from the database.
 */
export async function getSystemSettings() {
    try {
        await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
        console.log("[DB SUCCESS] Fetched system settings.");
        return { ...mockSystemSettings }; // Return a copy
    } catch (error) {
        console.error("Error fetching system settings:", error);
        throw new Error("Could not retrieve system configuration.");
    }
}

/**
 * Simulates updating global system settings in the database.
 * @param {object} newSettings - The new settings object to save.
 */
export async function updateSystemSettings(newSettings) {
    try {
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
        mockSystemSettings = { ...newSettings }; // Update mock state
        console.log("[DB SUCCESS] Updated system settings:", mockSystemSettings);
        return { success: true };
    } catch (error) {
        console.error("Error updating system settings:", error);
        throw new Error("Could not save system configuration.");
    }
}