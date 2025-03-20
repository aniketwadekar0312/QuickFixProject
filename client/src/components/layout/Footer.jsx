import { Link } from "react-router-dom";
import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">HomeServe</h3>
            <p className="text-gray-400 text-sm mb-4">
              Your trusted platform for home services. Connecting quality
              service providers with customers since 2023.
            </p>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                aria-label="Facebook"
                className="text-gray-400 hover:text-white transition"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://x.com/?lang=en"
                aria-label="Twitter"
                target="_blank"
                className="text-gray-400 hover:text-white transition"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://www.instagram.com/"
                aria-label="Instagram"
                target="_blank"
                className="text-gray-400 hover:text-white transition"
              >
                <Instagram size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { name: "Home", path: "/" },
                { name: "Services", path: "/services" },
                { name: "Find Workers", path: "/workers" },
                { name: "About Us", path: "/about" },
                { name: "Contact", path: "/contact" },
              ].map((item, index) => (
                <li key={index}>
                  <Link
                    to={item.path}
                    className="text-gray-400 hover:text-white transition"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Providers */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              For Service Providers
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/register?role=worker"
                  className="text-gray-400 hover:text-white transition"
                >
                  Join as a Worker
                </Link>
              </li>
              <li>
                <Link
                  to="/how-it-works"
                  className="text-gray-400 hover:text-white transition"
                >
                  How It Works
                </Link>
              </li>
              <li>
                <Link
                  to="/resources"
                  className="text-gray-400 hover:text-white transition"
                >
                  Resources
                </Link>
              </li>
              <li>
                <Link
                  to="/success-stories"
                  className="text-gray-400 hover:text-white transition"
                >
                  Success Stories
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <MapPin size={16} className="mr-2 text-gray-400" />
                <span className="text-gray-400">
                  123 Service Road, Mumbai, India
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={16} className="mr-2 text-gray-400" />
                <span className="text-gray-400">+91 9876543210</span>
              </li>
              <li className="flex items-center">
                <Mail size={16} className="mr-2 text-gray-400" />
                <a
                  href="mailto:info@homeserve.com"
                  className="text-gray-400 hover:text-white transition"
                >
                  info@homeserve.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} HomeServe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
