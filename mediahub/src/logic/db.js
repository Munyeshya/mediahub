// /mediahub/src/logic/db.js (API Client - Uses fetch to talk to the Node.js server)
import { toast } from 'react-toastify'; 

// The URL where your new Node.js Express server is running
const API_BASE_URL = 'http://localhost:3001/api'; 
const AUTH_URL = `${API_BASE_URL}/login`;
const DASHBOARD_URL = `${API_BASE_URL}/admin/dashboard`;
const SETTINGS_URL = `${API_BASE_URL}/admin/settings`;

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
            // Success: Server responds with {id, role} (status 200)
            return response.json(); 
        } else if (response.status === 401) {
            // Invalid credentials
            const errorData = await response.json();
            toast.error(errorData.message || "Invalid credentials or role. Please try again.");
            return null;
        } else {
            // Other server errors (e.g., 500)
            const errorData = await response.json();
            toast.error(errorData.message || "A server error occurred during login.");
            return null;
        }
    } catch (error) {
        // Network or Connection error (Server is not running)
        console.error("Network or Fetch Error:", error);
        toast.error("Could not connect to the server. Please ensure the backend is running on http://localhost:3001.");
        return null;
    }
}

/**
 * Clears client-side authentication data (called by auth.jsx).
 */
export function logout() {
    localStorage.removeItem('userRole'); 
    console.log('User role removed from localStorage. Logout successful.');
}

// -------------------------------------------------------------------
// 2. DASHBOARD DATA & SETTINGS
// -------------------------------------------------------------------

/**
 * Fetches all dashboard overview data from the server.
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
        toast.error("Failed to load dashboard data. Check the server connection and logs.");
        throw error;
    }
}

/**
 * Retrieves all system settings from the server.
 */
export async function getSystemSettings() {
    try {
        const response = await fetch(SETTINGS_URL);
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        return response.json();
    } catch (error) {
        console.error("Error fetching system settings:", error);
        toast.error("Failed to load system settings. Check server logs.");
        throw error;
    }
}

/**
 * Updates a batch of system settings on the server.
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

