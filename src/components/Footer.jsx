import { Link } from 'react-router-dom';
import { MountainIcon, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

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
    return (
        <footer className="bg-gray-950 text-gray-400 border-t border-gray-800">
            <div className="container mx-auto px-4 py-12 md:py-16">
                
                {/* --- Top Section: Logo and Navigation Links --- */}
                <div className="grid grid-cols-2 gap-8 md:grid-cols-5 border-b border-gray-800 pb-10">
                    
                    {/* Brand / Contact Info */}
                    <div className="col-span-2 md:col-span-2">
                        <Link to="/" className="flex items-center space-x-2 mb-4">
                            <MountainIcon className="h-7 w-7 text-amber-500" />
                            <span className="text-2xl font-bold text-white">MediaHub Rwanda</span>
                        </Link>
                        <p className="text-sm max-w-sm mb-4">
                            The centralized platform transforming the multimedia service industry in Rwanda. Book creatives with confidence.
                        </p>
                        <p className="text-sm font-semibold text-white">
                            © {new Date().getFullYear()} MediaHub Rwanda. All rights reserved.
                        </p>
                    </div>

                    {/* Navigation Columns */}
                    {Object.entries(footerNav).map(([section, links]) => (
                        <div key={section} className="col-span-1">
                            <h3 className="text-lg font-semibold text-amber-500 mb-4">{section}</h3>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link.name}>
                                        <Link 
                                            to={link.href} 
                                            className="text-sm hover:text-white transition-colors"
                                        >
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* --- Bottom Section: Social Links --- */}
                <div className="flex flex-col md:flex-row justify-between items-center pt-8">
                    
                    <div className="text-sm text-gray-500 order-2 md:order-1 mt-6 md:mt-0">
                        Designed with 🖤 for the Rwandan Creative Economy.
                    </div>

                    <div className="flex space-x-6 order-1 md:order-2">
                        <a href="#" aria-label="Facebook" className="hover:text-amber-500 transition-colors">
                            <Facebook className="h-6 w-6" />
                        </a>
                        <a href="#" aria-label="Twitter" className="hover:text-amber-500 transition-colors">
                            <Twitter className="h-6 w-6" />
                        </a>
                        <a href="#" aria-label="Instagram" className="hover:text-amber-500 transition-colors">
                            <Instagram className="h-6 w-6" />
                        </a>
                        <a href="#" aria-label="LinkedIn" className="hover:text-amber-500 transition-colors">
                            <Linkedin className="h-6 w-6" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}