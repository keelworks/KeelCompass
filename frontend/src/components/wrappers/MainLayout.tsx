import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../navigation/Sidebar";
import { MdNotificationsNone } from "react-icons/md";
import { BsQuestionCircle } from "react-icons/bs";
import { FiChevronDown, FiLogOut, FiMenu, FiSun, FiMoon } from "react-icons/fi";
import { getMe } from "../../utils/store";
import { useTheme } from "../../utils/theme";

interface MainLayoutProps {
  children: React.ReactNode;
  searchBar?: React.ReactNode;
  showAsk?: boolean;
  questionTitle?: string;
  onHomeClick?: () => void;
}

const MainLayout = ({
  children,
  searchBar,
  showAsk = false,
  questionTitle,
  onHomeClick,
}: MainLayoutProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [username, setUsername] = useState("User");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const user = await getMe();
        console.log("Fetched user data:", user);
        setUsername(user.username);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  return (
    <div className="flex min-h-screen bg-[#F9F9F9] dark:bg-[#0F1113]">
      {/* Sidebar */}
      <div className="flex-none lg:transition-all lg:duration-300">
        <Navigation
          showAsk={showAsk}
          questionTitle={questionTitle}
          onHomeClick={onHomeClick}
          mobileOpen={mobileNavOpen}
          onMobileClose={() => setMobileNavOpen(false)}
          theme={theme}
        />
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden py-4 px-4 sm:px-6 lg:pl-8 lg:px-6 max-w-7xl mx-auto w-full">
        {/* Header: hamburger + icons on their own row on mobile; search bar wraps to its own row */}
        <div className="flex flex-wrap items-center gap-3 mb-4 lg:mb-2">
          {/* Hamburger (mobile only) */}
          <button
            onClick={() => setMobileNavOpen(true)}
            aria-label="Open menu"
            className="order-1 shrink-0 flex items-center justify-center w-9 h-9 rounded-md text-gray-700 hover:bg-gray-200 dark:text-gray-300 dark:hover:bg-white/10 lg:hidden"
          >
            <FiMenu size={22} />
          </button>

          <div className="order-3 lg:order-2 w-full lg:w-auto lg:flex-1 min-w-0">
            {searchBar}
          </div>

          {/* Icon cluster */}
          <div className="order-2 lg:order-3 ml-auto lg:ml-0 flex items-center gap-3 lg:gap-4 shrink-0">
            {/* Dark mode toggle */}
            <button
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="flex items-center justify-center text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
            </button>

            {/* Bell Icon */}
            <div className="relative group cursor-pointer text-gray-700 dark:text-gray-300">
              <MdNotificationsNone size={20} />
              <span
                className="absolute -top-1 -right-1 bg-yellow-400 text-white text-[10px]
                w-4 h-4 rounded-full flex items-center justify-center"
              >
                1
              </span>
            </div>

            {/* Help Icon */}
            <div className="relative group cursor-pointer text-gray-700 dark:text-gray-300">
              <BsQuestionCircle size={20} />
            </div>

            {/* Profile & Dropdown */}
            <div
              className="relative flex items-center space-x-2 cursor-pointer"
              onClick={() => setShowDropdown((prev) => !prev)}
              ref={dropdownRef}
            >
              <img
                src="https://i.pravatar.cc/40"
                alt="Profile"
                className="w-6 h-6 rounded-full"
              />
              <div className="leading-tight hidden sm:block">
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 -mb-1">
                  {username}
                </p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400">Student</p>
              </div>
              <FiChevronDown
                size={16}
                className={`text-gray-600 dark:text-gray-400 transition-transform duration-200 ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 top-8 w-36 z-50">
                  <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-start gap-2 text-red-500 bg-white dark:bg-gray-800 font-medium text-sm py-2 px-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-red-600 transition duration-200"
                    >
                      <FiLogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content Grid - moved closer to top */}
        <div className="flex-1 overflow-auto mt-0 pt-0 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
