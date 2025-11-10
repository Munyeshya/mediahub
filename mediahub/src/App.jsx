// src/App.jsx (Final Authentication Setup)
import { Routes, Route, Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 
import { AuthProvider } from './logic/auth'; // 💥 Import AuthProvider
import { ProtectedRoute } from './components/ProtectedRoute'; // 💥 Import ProtectedRoute

// Public Components
import { Header } from './components/Header';
import { Footer } from './components/Footer'; 

// Public Pages
import { Home } from './pages/Home';
import { FindServices } from './pages/FindServices';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login';
import { GiverProfile } from './pages/GiverProfile';

// Dashboard Pages
import { AdminDashboard } from './pages/dashboard/AdminDashboard';
import { ClientDashboard } from './pages/dashboard/ClientDashboard'; 
import { GiverDashboard } from './pages/dashboard/GiverDashboard';


// --- Define the Public Layout Component ---
// (No change needed here)
const PublicLayout = () => {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            <Header />
            <main className="flex-grow">
                <Outlet /> 
            </main>
            <Footer />
        </div>
    );
};

// --- Main Application Component with Separated Routes ---
function App() {
    return (
        // 💥 Wrap the entire application logic in AuthProvider
        <AuthProvider> 
            <ToastContainer position="bottom-right" theme="dark" /> 
            
            <Routes>
                
                {/* ROUTE GROUP A: PROTECTED DASHBOARD ROUTES */}
                {/* Use a parent Route element with ProtectedRoute to guard all nested dashboard paths */}
                <Route element={<ProtectedRoute allowedRole="Admin" />}>
                    <Route path="/dashboard/admin/*" element={<AdminDashboard />} /> 
                </Route>
                
                <Route element={<ProtectedRoute allowedRole="Client" />}>
                    <Route path="/dashboard/client/*" element={<ClientDashboard />} /> 
                </Route>

                <Route element={<ProtectedRoute allowedRole="Giver" />}>
                    <Route path="/dashboard/giver/*" element={<GiverDashboard />} />
                </Route>

                {/* ROUTE GROUP B: STANDALONE PUBLIC PAGES */}
                <Route path="/login" element={<Login />} />
                
                {/* ROUTE GROUP C: PUBLIC PAGES (with PublicLayout) */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<FindServices />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/giver/:giverId" element={<GiverProfile />} />
                </Route>
            </Routes>
        </AuthProvider>
    );
}

export default App;