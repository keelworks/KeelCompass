import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BsHouseDoor, BsSearch } from "react-icons/bs"; // Import icons
import { RiQuestionnaireLine } from "react-icons/ri";
import { FaBook } from "react-icons/fa"; // Import book icon for footer
import Logo from "../assets/logo.png";

const Navigation: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  // Get the current location
  const location = useLocation();

  // Define menu items
  const menuItems = [
    { name: "Dashboard", icon: <BsHouseDoor />, path: "/" },
    { name: "Q&A Discussion", icon: <RiQuestionnaireLine />, path: "/qna" },
    { name: "Search", icon: <BsSearch />, path: "/search" },
  ];

  return (
    <div
      className={`flex flex-col ${
        collapsed ? "w-20" : "w-64"
      } h-screen bg-white shadow-md transition-all duration-300`}
    >
      {/* Header Section */}
      <div className="flex items-center px-4 py-4">
        <img
          src={Logo}
          alt="Logo"
          onClick={() => setCollapsed(!collapsed)} // Add the toggle functionality
          className="h-10 w-10 rounded-full flex-shrink-0 cursor-pointer hover:bg-gray-100 p-1 transition"
          aria-label="Toggle Sidebar"
        />{" "}
        {!collapsed && (
          <div className="ml-4">
            <h1 className="font-semibold text-lg">
              <span className="text-red-950">Keel</span>
              <span className="text-custom-gradient">Compass</span>
            </h1>
            <p className="text-gray-500 text-sm">Knowledge Base</p>
          </div>
        )}
      </div>

      {/* Menu Section */}
      <div className="flex-1">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center px-4 py-2 rounded-md mb-2 ${
              collapsed ? "justify-center" : ""
            } ${
              location.pathname === item.path
                ? "bg-custom-gradient text-white"
                : "text-gray-700 hover:bg-custom-sidebar-hover-bg hover:text-teal-500"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {!collapsed && (
              <span className="ml-4 text-sm font-medium">{item.name}</span>
            )}
          </Link>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-4"></div>

      {/* Footer Section */}
      <div
        className={`flex items-center px-4 py-2 ${
          collapsed ? "justify-center" : ""
        } text-gray-600 hover:text-purple-500`}
      >
        <span className="text-xl">
          <FaBook />
        </span>
        {!collapsed && (
          <span className="ml-4 text-sm font-medium">
            KeelLearn <span className="text-purple-500">↗</span>
          </span>
        )}
      </div>
    </div>
  );
};

export default Navigation;
