import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-navy text-white py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex flex-col mb-4">
              <span className="text-xl font-bold tracking-wide">META POINT</span>
              <div className="h-1 w-16 bg-orange"></div>
            </div>
            <p className="text-white/80 text-sm">
              Global market insights and thought leadership in investing.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link to="/" className="block text-white/80 hover:text-orange text-sm transition-colors">
                Home
              </Link>
              <Link to="/about" className="block text-white/80 hover:text-orange text-sm transition-colors">
                About
              </Link>
              <Link to="/advisors" className="block text-white/80 hover:text-orange text-sm transition-colors">
                Advisory Services
              </Link>
              <Link to="/contact" className="block text-white/80 hover:text-orange text-sm transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <div className="space-y-2 text-sm text-white/80">
              <p>51 Maryland Ave</p>
              <p>Rehoboth Beach, DE 19971</p>
              <a href="mailto:mmjoelson@gmail.com" className="block hover:text-orange transition-colors">
                mmjoelson@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/20 pt-8 text-center text-sm text-white/60">
          <p>&copy; {new Date().getFullYear()} Meta Point Advisors. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
