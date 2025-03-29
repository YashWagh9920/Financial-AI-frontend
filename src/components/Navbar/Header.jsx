import React, { useEffect, useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logout } from "../../Store/authSlice";
import { motion } from "framer-motion";
import { Globe, Menu, X } from "lucide-react";
import {cn} from "../ui/utils"
import image from "../../assets/woman-image1.jpg";

function Header() {
  const authstatus = useSelector((state) => state.auth.status);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showTranslate, setShowTranslate] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const userData = useSelector(state => state.auth.userData);

  const navItems = authstatus
    ? ["Home", "Chatbot", "Dashboard", "Microfinance", "Newsletter", "Community"]
    : ["Home", "Login", "Signup"];

  useEffect(() => {
    if (!window.googleTranslateElementInit) {
      const addScript = document.createElement("script");
      addScript.src =
        "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
      addScript.async = true;
      document.body.appendChild(addScript);

      window.googleTranslateElementInit = () => {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "en",
            includedLanguages: "en,hi,kn,ml,mr,pa,ta,te,bn,gu,or,as,ur,ks,sd,sa,ne,si,bo,doi,brx,mni,ksf,kok",
            layout: window.google.translate.TranslateElement.InlineLayout.HORIZONTAL,
          },
          "google_translate_element"
        );
      };
    }
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/users/logout`, null, { withCredentials: true });
      dispatch(logout());
      navigate("/");
    } catch (err) {
      console.error('Logout failed:', err.response?.data?.message || err.message);
    }
  };

  return (
    <nav className="sticky top-0 w-full bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-teal-400 transition-colors"
          >
            {isMobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <NavLink
                key={item}
                to={item === "Home" ? "/" : item === "Signup" ? "/register" : `/${item.toLowerCase()}`}
                className={({ isActive }) => cn(
                  "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-gradient-to-r from-teal-500 to-cyan-500 text-white" 
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                )}
              >
                {item}
              </NavLink>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Google Translate */}
            <div className="relative">
              <button
                onClick={() => setShowTranslate(!showTranslate)}
                className="flex items-center gap-2 px-3 py-2 text-gray-300 hover:text-white rounded-md transition-colors"
              >
                <Globe className="w-5 h-5" />
                <span>Translate</span>
              </button>
              <div
                id="google_translate_element"
                className={`absolute top-12 right-0 bg-gray-800 rounded-lg shadow-xl p-3 ${
                  showTranslate ? "block" : "hidden"
                }`}
              />
            </div>

            {authstatus && (
              <>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-red-400 hover:text-red-300 transition-colors"
                >
                  Logout
                </button>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="relative cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-full blur opacity-30" />
                  <img
                    src={image}
                    alt="Profile"
                    className="w-8 h-8 rounded-full border-2 border-gray-700"
                  />
                </motion.div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-gray-900 border-t border-gray-800">
            {navItems.map((item) => (
              <NavLink
                key={item}
                to={item === "Home" ? "/" : item === "Signup" ? "/register" : `/${item.toLowerCase()}`}
                className={({ isActive }) => cn(
                  "block px-4 py-3 text-sm font-medium transition-colors border-b border-gray-800",
                  isActive 
                    ? "bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-400" 
                    : "text-gray-300 hover:bg-gray-800 hover:text-white"
                )}
                onClick={() => setIsMobileOpen(false)}
              >
                {item}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Header;