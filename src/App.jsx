// src/App.jsx (CORRECTED STRUCTURE)
import { Routes, Route, Outlet } from 'react-router-dom'; // 💥 Import Outlet for Layout
import { ToastContainer } from 'react-toastify'; // 💥 NEW IMPORT for Toastify Container
import 'react-toastify/dist/ReactToastify.css'; // 💥 NEW CSS IMPORT for styles

// Public Components
import { Header } from './components/Header';
import { Footer } from './components/Footer'; 

// Public Pages
import { Home } from './pages/Home';
import { FindServices } from './pages/FindServices';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Profile } from './pages/Profile';
import { Login } from './pages/Login'; // Login is usually standalone

// Dashboard Pages
import { AdminDashboard } from './pages/dashboard/AdminDashboard';
import { ClientDashboard } from './pages/dashboard/ClientDashboard'; 
import { GiverDashboard } from './pages/dashboard/GiverDashboard';

// --- 1. Define the Public Layout Component ---
// This component renders the public Header/Footer around the nested content (<Outlet />)
const PublicLayout = () => {
    return (
        <div className="min-h-screen bg-gray-900 flex flex-col">
            <Header />
            <main className="flex-grow">
                {/* Renders the child route components (Home, About, Services, etc.) */}
                <Outlet /> 
            </main>
            <Footer />
        </div>
    );
};

// --- 2. Main Application Component with Separated Routes ---
function App() {
    return (
        <>
            {/* Sonner Toaster is a root-level utility, place it outside the main div */}
            <ToastContainer position="bottom-right" theme="dark" />
            <Routes>
                
                {/* 💥 ROUTE GROUP A: DASHBOARD ROUTES (Standalone - NO Public Header/Footer) */}
                {/* We use the '/*' path pattern here because AdminDashboard.jsx
                   now contains its own nested <Routes> and <Outlet> for pages like /dashboard/admin/services.
                */}
                <Route path="/dashboard/admin/*" element={<AdminDashboard />} /> 
                <Route path="/dashboard/client/*" element={<ClientDashboard />} /> 
                <Route path="/dashboard/giver/*" element={<GiverDashboard />} />

                {/* 💥 ROUTE GROUP B: STANDALONE PAGES (No Layout - e.g., Login, Register) */}
                {/* Login page manages its own full-screen layout. */}
                <Route path="/login" element={<Login />} />
                
                {/* 💥 ROUTE GROUP C: PUBLIC PAGES (Wrapped in PublicLayout) */}
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<FindServices />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/profile" element={<Profile />} />
                </Route>

                {/* You may want to add a catch-all 404 route here */}
                {/* <Route path="*" element={<NotFound />} /> */}
                
            </Routes>
        </>
    );
}

export default App;