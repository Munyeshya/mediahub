// /src/logic/db.js (Unified Frontend API Client)
import { toast } from 'react-toastify'; 

// --- API URL CONFIGURATION ---
const API_BASE_URL = 'http://localhost:3001/api'; 
const AUTH_URL = `${API_BASE_URL}/login`;
const DASHBOARD_URL = `${API_BASE_URL}/admin/dashboard`;
const SETTINGS_URL = `${API_BASE_URL}/admin/settings`;
const GIVERS_URL = `${API_BASE_URL}/admin/givers`; // URL for Admin: Manage Givers

// -------------------------------------------------------------------
// 1. AUTHENTICATION LOGIC
// -------------------------------------------------------------------

/**
 * Communicates with the new backend server for authentication.
 * @param {string} email - The user's email.
 * @param {string} password - The plaintext password.
 * @param {string} role - The selected role ('Admin', 'Client', or 'Giver').
 * @returns {Promise<object|null>} Object {id, role} on successful login, or null on failure.
 */
export async function authenticateLogin(email, password, role) {
    try {
        const response = await fetch(AUTH_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role }),
        });

        if (response.ok) {
            // Success: Server responds with {id, role} (status 200)
            const userData = await response.json(); 
            toast.success(`Welcome, ${role} user!`);
            return userData; 
        } else if (response.status === 401) {
            // Invalid credentials
            const errorData = await response.json();
            toast.error(errorData.message || "Invalid credentials or role.");
            return null;
        } else {
            // Other server error (e.g., 500)
            throw new Error(`Authentication failed with status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error in authenticateLogin:", error);
        toast.error("Network or Server error. Could not connect to the API.");
        // Re-throw for caller to handle
        throw error;
    }
}

/**
 * Clears authentication data from local storage on logout.
 */
export function logout() {
    // Clear user-specific data from storage
    localStorage.removeItem('userId'); 
    localStorage.removeItem('userRole');
    console.log("Client-side logout complete.");
}

// -------------------------------------------------------------------
// 2. ADMIN: DASHBOARD DATA
// -------------------------------------------------------------------

/**
 * Fetches all key metrics and chart data for the Admin Dashboard.
 */
export async function fetchDashboardOverviewData() {
    try {
        const response = await fetch(DASHBOARD_URL);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server responded with status: ${response.status}. Body: ${errorText}`);
        }
        
        // Data structure: { keyMetrics, monthlyRevenueData, giverStatusData, serviceUsageData }
        return response.json(); 
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast.error("Failed to load dashboard data. Check the server connection.");
        throw error;
    }
}

// -------------------------------------------------------------------
// 3. ADMIN: MANAGE GIVERS DATA
// -------------------------------------------------------------------

/**
 * Fetches the list of all Givers for the Admin Management page.
 */
export async function fetchGivers() {
    try {
        const response = await fetch(GIVERS_URL);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server responded with status: ${response.status}. Body: ${errorText}`);
        }
        
        // Returns an array of giver objects
        return response.json(); 
    } catch (error) {
        console.error("Error fetching givers list:", error);
        toast.error("Failed to load Giver list. Check the server connection and logs.");
        throw error;
    }
}

/**
 * 💥 NEW EXPORTED FUNCTION: updateGiverStatus
 * Updates the verification status of a Service Giver using a PUT request.
 * @param {number} giverId - The ID of the giver to update.
 * @param {boolean} isVerified - The new verification status.
 * @returns {Promise<boolean>} True on success.
 */
export async function updateGiverStatus(giverId, isVerified) {
    try {
        // Targets the new PUT route we created: /api/admin/givers/:giverId/status
        const response = await fetch(`${GIVERS_URL}/${giverId}/status`, {
            method: 'PUT', // Use PUT for updating a resource
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ isVerified }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Server status update failed: ${errorData.message}`);
        }
        
        const message = isVerified ? "Giver successfully **Activated**." : "Giver successfully **Deactivated** (Set to Pending).";
        toast.success(message);
        return true;
    } catch (error) {
        console.error("Error updating giver status:", error);
        toast.error(`Failed to update status for Giver ID ${giverId}.`);
        throw error;
    }
}
// -------------------------------------------------------------------
// 4. ADMIN: SYSTEM SETTINGS
// -------------------------------------------------------------------

/**
 * Retrieves all system settings from the backend.
 * @returns {Promise<object>} An object of setting_key: setting_value pairs.
 */
export async function getSystemSettings() {
    try {
        const response = await fetch(SETTINGS_URL);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server responded with status: ${response.status}. Body: ${errorText}`);
        }

        // Returns { setting_key: setting_value, ... }
        return response.json();
    } catch (error) {
        console.error("Error fetching system settings:", error);
        toast.error("Failed to load system settings. Check the server connection.");
        throw error;
    }
}

/**
 * Updates a batch of system settings on the backend.
 * @param {object} settings - An object of setting_key: setting_value pairs to update.
 * @returns {Promise<boolean>} True on success.
 */
export async function updateSystemSettings(settings) {
    try {
        const response = await fetch(SETTINGS_URL, {
            method: 'POST', // We use POST for batch updates/UPSERT
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(settings),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Server responded with status: ${response.status}. Message: ${errorData.message}`);
        }
        
        const result = await response.json();
        toast.success(result.message || "Settings saved successfully.");
        return true;
    } catch (error) {
        console.error("Error updating system settings:", error);
        // Note: The toast is thrown inside the error block here as well, 
        // to catch network errors not just server error messages.
        toast.error("Failed to save system settings. Check server logs.");
        throw error;
    }
}