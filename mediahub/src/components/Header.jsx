import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { 
  // Using Sheet components for the full-height mobile drawer
  Sheet, 
  SheetContent, 
  SheetTrigger, 
  SheetTitle, 
  SheetDescription,
  SheetClose 
} from "@/components/ui/sheet"; 
import { Menu, MountainIcon, X } from "lucide-react";

// Navigation links
const navItems = [
  { name: "Home", href: "/" },
  { name: "Find Services", href: "/services" },
  { name: "Profile", href: "/profile" },        
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-700 bg-gray-900/90 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        
        {/* Logo/Brand Name (Visible on all screen sizes) */}
        <Link to="/" className="flex items-center space-x-2">
          <MountainIcon className="h-6 w-6 text-amber-500" />
          <span className="text-2xl font-bold text-white">MediaHub</span>
        </Link>

        {/* --- Desktop Navigation --- */}
        <nav className="hidden space-x-6 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="text-md font-medium transition-colors text-gray-300 hover:text-amber-500"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons (Desktop) */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/login">
          <Button variant="outline" className="text-amber-500 border-amber-500 hover:bg-amber-900/20">
            Login
          </Button>
          </Link>
          <Button className="bg-amber-500 text-gray-900 hover:bg-amber-400">
            Book Creative
          </Button>
        </div>

        {/* --- Mobile Menu (Sheet) --- */}
        <Sheet>
          {/* Trigger (Hamburger Icon) */}
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-amber-500">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>

          <SheetContent 
            side="right"
            // FINAL FIX: Hides the default close button and applies custom full-height styling.
            className="w-3/4 max-w-xs bg-gray-900 border-l border-amber-500/50 p-0 flex flex-col [&>button]:hidden"
          >
            {/* Accessibility Titles (Screen Reader Only) */}
            <SheetTitle className="sr-only">Main Navigation Menu</SheetTitle>
            <SheetDescription className="sr-only">
              Use this menu to navigate between the Home, Services, Profile, About, and Contact pages, or to log in and book a creative.
            </SheetDescription>
            
            {/* Menu Header/Close Button (The custom, visible one) */}
            <div className="flex justify-end px-6 py-4 border-b border-gray-700 flex-shrink-0">
                <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="text-amber-500">
                        <X className="h-6 w-6" />
                    </Button>
                </SheetClose>
            </div>
            
            {/* Mobile Navigation Links (Scrollable area) */}
            <nav className="flex flex-col space-y-1 px-6 pt-4 flex-grow overflow-y-auto">
                <Link to="/" className="flex items-center space-x-2 mb-4">
                    <MountainIcon className="h-6 w-6 text-amber-500" />
                    <span className="text-lg font-bold text-white">MediaHub Rwanda</span>
                </Link>

                {navItems.map((item) => (
                    // CRITICAL: Wrap Link in SheetClose to close menu on navigation
                    <SheetClose asChild key={item.name}> 
                        <Link
                            to={item.href}
                            className="block text-lg font-medium text-gray-200 hover:text-amber-500 transition-colors py-3 border-b border-gray-800 last:border-b-0"
                        >
                            {item.name}
                        </Link>
                    </SheetClose>
                ))}
            </nav>

            {/* Mobile CTAs (Fixed to bottom) */}
            <div className="px-6 pb-6 pt-4 border-t border-gray-700 flex flex-col space-y-4 flex-shrink-0">
                <SheetClose asChild>
                    <Button variant="outline" className="text-amber-500 border-amber-500 hover:bg-amber-900/20 w-full">
                        Login
                    </Button>
                </SheetClose>
                <SheetClose asChild>
                    <Button className="bg-amber-500 text-gray-900 hover:bg-amber-400 w-full">
                        Book Creative
                    </Button>
                </SheetClose>
            </div>
            
          </SheetContent>
        </Sheet>
        
      </div>
    </header>
  );
}