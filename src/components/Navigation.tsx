import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut, Shield } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, isAdmin, signOut } = useAuth();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Newsletter", path: "/newsletter" },
    { name: "Archive", path: "/archive" },
    { name: "Advisors", path: "/advisors" },
    { name: "Subscribe", path: "/subscribe" },
    { name: "Contact", path: "/contact" },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-navy text-white sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-wide">META POINT</span>
              <div className="h-1 w-16 bg-orange"></div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium hover:text-orange transition-colors relative pb-1 ${
                  isActive(item.path) ? "text-white" : "text-white/80"
                }`}
              >
                {item.name}
                {isActive(item.path) && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange"></div>
                )}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={`text-sm font-medium hover:text-orange transition-colors relative pb-1 flex items-center gap-1 ${
                  location.pathname.startsWith('/admin') ? "text-white" : "text-white/80"
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin
                {location.pathname.startsWith('/admin') && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange"></div>
                )}
              </Link>
            )}
            {user ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={signOut}
                className="text-white hover:text-orange hover:bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="text-white hover:text-orange hover:bg-transparent">
                  Sign In
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsMenuOpen(false)}
                className={`block py-3 text-sm font-medium hover:text-orange transition-colors ${
                  isActive(item.path) ? "text-orange" : "text-white/80"
                }`}
              >
                {item.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className={`block py-3 text-sm font-medium hover:text-orange transition-colors flex items-center gap-2 ${
                  location.pathname.startsWith('/admin') ? "text-orange" : "text-white/80"
                }`}
              >
                <Shield className="w-4 h-4" />
                Admin
              </Link>
            )}
            {user ? (
              <button
                onClick={() => {
                  signOut();
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left py-3 text-sm font-medium text-white/80 hover:text-orange transition-colors flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            ) : (
              <Link
                to="/auth"
                onClick={() => setIsMenuOpen(false)}
                className="block py-3 text-sm font-medium text-white/80 hover:text-orange transition-colors"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
