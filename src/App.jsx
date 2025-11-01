//import { Button } from "@/components/ui/button"

// src/App.jsx
import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
// Import all your page components
import { Home } from './pages/Home';
import { FindServices } from './pages/FindServices';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Footer } from './components/Footer'; // <--- Import it

function App() {
  return (
    // Set the overall dark background for the entire application
    <div className="min-h-screen bg-gray-900"> 
      <Header />
      
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<FindServices />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          {/* Add a route for the 'Profile' page once its component is ready */}
          {/* <Route path="/profile" element={<Profile />} /> */}
        </Routes>
      </main>
      
      <Footer />
      
      {/* Footer component will go here later */}
    </div>
  );
}

export default App;