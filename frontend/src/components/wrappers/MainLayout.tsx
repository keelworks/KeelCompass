import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../navigation/Sidebar";
import { MdNotificationsNone } from "react-icons/md";
import { BsQuestionCircle } from "react-icons/bs";
import { FiChevronDown, FiLogOut } from "react-icons/fi";

interface MainLayoutProps {
  children: React.ReactNode;
  searchBar?: React.ReactNode;
  showAsk?: boolean;
}

const MainLayout = ({
  children,
  searchBar,
  showAsk = false,
}: MainLayoutProps) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/");
  };

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
    <div className="flex justify-center w-full bg-[#F9F9F9] pr-8 2xl:pr-0">
      <div className="flex min-h-screen w-full max-w-[1497px]">
        {/* Sidebar */}
        <div className="flex-none transition-all duration-300">
          <Navigation showAsk={showAsk} />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden py-4 pl-6 max-w-[1280px] mx-auto">
          {/* Top Row: Profile Header only */}
          <div className="flex items-center justify-end space-x-4 pr-1 relative mb-2">
            {/* Bell Icon */}
            <div className="relative group cursor-pointer text-gray-700">
              <MdNotificationsNone size={20} />
              <span
                className="absolute -top-1 -right-1 bg-yellow-400 text-white text-[10px]
              w-4 h-4 rounded-full flex items-center justify-center"
              >
                1
              </span>
            </div>

            {/* Help Icon */}
            <div className="relative group cursor-pointer text-gray-700">
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
              <div className="leading-tight">
                <p className="text-sm font-semibold text-gray-900 -mb-1">
                  Louise Paulie
                </p>
                <p className="text-[10px] text-gray-500">Student</p>
              </div>
              <FiChevronDown
                size={16}
                className={`text-gray-600 transition-transform duration-200 ${
                  showDropdown ? "rotate-180" : ""
                }`}
              />

              {/* Dropdown */}
              {showDropdown && (
                <div className="absolute right-0 top-8 w-36 z-50">
                  <div className="bg-white border border-gray-200 rounded-lg shadow-md p-2">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center justify-start gap-2 text-red-500 bg-white font-medium text-sm py-2 px-3 rounded-md hover:bg-gray-50 hover:text-red-600 transition duration-200"
                    >
                      <FiLogOut size={16} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content Grid - moved closer to top */}
          <div className="flex-1 overflow-auto mt-0 pt-0 grid grid-cols-3 gap-8">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
