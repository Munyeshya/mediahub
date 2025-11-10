// src/components/Header.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu, MountainIcon, X } from "lucide-react";
import { useAuth } from "@/logic/auth"; // ✅ import auth context

const navItems = [
  { name: "Home", href: "/" },
  { name: "Find Services", href: "/services" },
  { name: "Profile", href: "/profile" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();

  // ✅ Determine dashboard link dynamically
  const dashboardPath = user?.role
    ? `/dashboard/${user.role.toLowerCase()}`
    : "/dashboard";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-700 bg-gray-900/90 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <MountainIcon className="h-6 w-6 text-amber-500" />
          <span className="text-2xl font-bold text-white">MediaHub</span>
        </Link>

        {/* Desktop Navigation */}
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

        {/* Desktop CTA buttons */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <Link to={dashboardPath}>
                <Button className="bg-amber-500 text-gray-900 hover:bg-amber-400">
                  Dashboard
                </Button>
              </Link>
              <Button
                variant="outline"
                onClick={logout}
                className="text-red-400 border-red-400 hover:bg-red-900/20"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="outline"
                  className="text-amber-500 border-amber-500 hover:bg-amber-900/20"
                >
                  Login
                </Button>
              </Link>
              <Button className="bg-amber-500 text-gray-900 hover:bg-amber-400">
                Book Creative
              </Button>
            </>
          )}
        </div>

        {/* --- Mobile Menu --- */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-amber-500">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>

          <SheetContent
            side="right"
            className="w-3/4 max-w-xs bg-gray-900 border-l border-amber-500/50 p-0 flex flex-col [&>button]:hidden"
          >
            <SheetTitle className="sr-only">Main Menu</SheetTitle>
            <SheetDescription className="sr-only">
              Mobile navigation for MediaHub.
            </SheetDescription>

            <div className="flex justify-end px-6 py-4 border-b border-gray-700 flex-shrink-0">
              <SheetClose asChild>
                <Button variant="ghost" size="icon" className="text-amber-500">
                  <X className="h-6 w-6" />
                </Button>
              </SheetClose>
            </div>

            <nav className="flex flex-col space-y-1 px-6 pt-4 flex-grow overflow-y-auto">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <MountainIcon className="h-6 w-6 text-amber-500" />
                <span className="text-lg font-bold text-white">MediaHub Rwanda</span>
              </Link>

              {navItems.map((item) => (
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

            {/* ✅ Mobile footer buttons */}
            <div className="px-6 pb-6 pt-4 border-t border-gray-700 flex flex-col space-y-4 flex-shrink-0">
              {isAuthenticated ? (
                <>
                  <SheetClose asChild>
                    <Link to={dashboardPath}>
                      <Button className="bg-amber-500 text-gray-900 hover:bg-amber-400 w-full">
                        Dashboard
                      </Button>
                    </Link>
                  </SheetClose>
                  <Button
                    variant="outline"
                    onClick={logout}
                    className="text-red-400 border-red-400 hover:bg-red-900/20 w-full"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  <SheetClose asChild>
                    <Link to="/login">
                      <Button
                        variant="outline"
                        className="text-amber-500 border-amber-500 hover:bg-amber-900/20 w-full"
                      >
                        Login
                      </Button>
                    </Link>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button className="bg-amber-500 text-gray-900 hover:bg-amber-400 w-full">
                      Book Creative
                    </Button>
                  </SheetClose>
                </>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
