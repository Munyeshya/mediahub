import { Link } from 'react-router-dom';
import { MountainIcon, Facebook, Twitter, Instagram, Linkedin, Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button'; // Assuming you have a button component
import { Input } from '@/components/ui/input'; // Assuming you have an input component

// Define navigation structure for the Footer
const footerNav = {
    Company: [
        { name: "About Us", href: "/about" },
        { name: "Careers", href: "#" },
        { name: "Our Mission", href: "/about#mission" },
        { name: "Contact", href: "/contact" },
    ],
    Services: [
        { name: "Find Services", href: "/services" },
        { name: "List Your Service", href: "/register" },
        { name: "Equipment Rental", href: "#" },
        { name: "Top-Rated Creatives", href: "/services" },
    ],
    Legal: [
        { name: "Terms of Service", href: "#" },
        { name: "Privacy Policy", href: "#" },
        { name: "Cookie Policy", href: "#" },
        { name: "Sitemap", href: "#" },
    ],
};

export function Footer() {
    // Handler for the mock newsletter submission
    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        alert("Thanks for subscribing! We'll keep you updated.");
        // Add actual subscription API logic here
    };

    return (
        <footer className="bg-gray-950 text-gray-400">
            {/* 💥 UPGRADE 1: Gradient Top Border for a sleek division */}
            <div className="h-0.5 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent"></div>

            {/* 💥 UPGRADE 2: Increased container width to max-w-7xl */}
            <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
                
                {/* --- Top Section: Logo, Newsletter, and Navigation Links --- */}
                <div className="grid grid-cols-2 gap-8 md:grid-cols-12 border-b border-gray-800 pb-10">
                    
                    {/* Brand / Newsletter (3 columns wide) */}
                    <div className="col-span-2 md:col-span-4 flex flex-col justify-between">
                        <div>
                            <Link to="/" className="flex items-center space-x-3 mb-4">
                                <MountainIcon className="h-8 w-8 text-amber-500" />
                                <span className="text-2xl font-extrabold text-white">MediaHub Rwanda</span>
                            </Link>
                            <p className="text-sm max-w-xs mb-6">
                                The centralized platform transforming the multimedia service industry in Rwanda. **Book creatives with confidence.**
                            </p>
                        </div>
                        
                        {/* 💥 UPGRADE 3: Newsletter/Subscription Block */}
                        <form onSubmit={handleNewsletterSubmit} className="mt-6 md:mt-0">
                            <h4 className="text-base font-semibold text-white mb-3 flex items-center">
                                <Mail className="h-4 w-4 mr-2 text-amber-500" /> Stay Updated
                            </h4>
                            <div className="flex w-full max-w-sm items-center space-x-2">
                                <Input 
                                    type="email" 
                                    placeholder="Your email address" 
                                    className="bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-amber-500" 
                                    required
                                />
                                <Button 
                                    type="submit" 
                                    className="bg-amber-500 hover:bg-amber-400 text-gray-900 font-bold"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* Navigation Columns (2 columns each, totaling 6 columns) */}
                    {Object.entries(footerNav).map(([section, links]) => (
                        <div key={section} className="col-span-1 md:col-span-2">
                            <h3 className="text-lg font-bold text-amber-500 mb-5">{section}</h3>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <Link 
                                            to={link.href} 
                                            // 💥 UPGRADE 4: Enhanced Hover Effect
                                            className="text-sm text-gray-400 hover:text-amber-400 transition-colors duration-200"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* --- Bottom Section: Copyright and Social Links --- */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8">
                    
                    <div className="text-sm text-gray-500 order-2 md:order-1 mt-6 md:mt-0">
                        © {new Date().getFullYear()} MediaHub Rwanda. All rights reserved. | Designed with 🖤 for the Rwandan Creative Economy.
                    </div>

                    {/* 💥 UPGRADE 5: Social Links with stronger hover effect */}
                    <div className="flex space-x-6 order-1 md:order-2">
                        <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-amber-500 transition-colors duration-200">
                            <Facebook className="h-6 w-6" />
                        </a>
                        <a href="#" aria-label="Twitter" className="text-gray-400 hover:text-amber-500 transition-colors duration-200">
                            <Twitter className="h-6 w-6" />
                        </a>
                        <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-amber-500 transition-colors duration-200">
                            <Instagram className="h-6 w-6" />
                        </a>
                        <a href="#" aria-label="LinkedIn" className="text-gray-400 hover:text-amber-500 transition-colors duration-200">
                            <Linkedin className="h-6 w-6" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}