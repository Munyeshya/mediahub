// /src/logic/db.js (Unified Frontend API Client - UPDATED with updateGiverStatus)
import { toast } from 'react-toastify'; 

// --- API URL CONFIGURATION ---
const API_BASE_URL = 'http://localhost:3001/api'; 
const AUTH_URL = `${API_BASE_URL}/login`;
const DASHBOARD_URL = `${API_BASE_URL}/admin/dashboard`;
const SETTINGS_URL = `${API_BASE_URL}/admin/settings`;
const GIVERS_URL = `${API_BASE_URL}/admin/givers`; // Base URL for Giver management

// -------------------------------------------------------------------
// 1. AUTHENTICATION LOGIC
// -------------------------------------------------------------------

/**
 * Communicates with the new backend server for authentication.
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
            const userData = await response.json(); 
            toast.success(`Welcome, ${role} user!`);
            return userData; 
        } else if (response.status === 401) {
            const errorData = await response.json();
            toast.error(errorData.message || "Invalid credentials or role.");
            return null;
        } else {
            throw new Error(`Authentication failed with status: ${response.status}`);
        }
    } catch (error) {
        console.error("Error in authenticateLogin:", error);
        toast.error("Network or Server error. Could not connect to the API.");
        throw error;
    }
}

/**
 * Clears authentication data from local storage on logout.
 */
export function logout() {
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
        
        return response.json(); 
    } catch (error) {
        console.error("Error fetching givers list:", error);
        toast.error("Failed to load Giver list. Check the server connection and logs.");
        throw error;
    }
}

/**
 * 💥 NEW EXPORT: Updates the verification status of a Service Giver.
 * This is the function that ManageGivers.jsx was looking for.
 * @param {number} giverId - The ID of the giver to update.
 * @param {boolean} isVerified - The new verification status.
 * @returns {Promise<boolean>} True on success.
 */
export async function updateGiverStatus(giverId, isVerified) {
    try {
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
 */
export async function getSystemSettings() {
    try {
        const response = await fetch(SETTINGS_URL);

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Server responded with status: ${response.status}. Body: ${errorText}`);
        }

        return response.json();
    } catch (error) {
        console.error("Error fetching system settings:", error);
        toast.error("Failed to load system settings. Check the server connection.");
        throw error;
    }
}

/**
 * Updates a batch of system settings on the backend.
 */
export async function updateSystemSettings(settings) {
    try {
        const response = await fetch(SETTINGS_URL, {
            method: 'POST', 
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
        toast.error("Failed to save system settings. Check server logs.");
        throw error;
    }
}