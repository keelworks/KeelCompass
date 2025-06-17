import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BsBoxArrowLeft,
  BsHouseDoor,
  BsChevronLeft,
  BsChevronRight,
} from "react-icons/bs";
import { HiOutlineChatBubbleLeftRight } from "react-icons/hi2";
import { GiOpenBook } from "react-icons/gi";
import Logo from "../assets/logo.png";

const Navigation: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", icon: <BsHouseDoor />, path: "/dashboard" },
    { name: "Q&A Discussion", icon: <HiOutlineChatBubbleLeftRight />, path: "/qna" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("lastActive");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    navigate("/auth");
  };

  return (
    <div
      className={`flex flex-col ${collapsed ? "w-20" : "w-64"} h-screen bg-white shadow-md transition-all duration-300 relative`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-6 bg-white rounded-full p-1 shadow-md border border-gray-200 hover:bg-gray-100 transition-colors duration-300 z-10"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <BsChevronRight className="text-gray-600" /> : <BsChevronLeft className="text-gray-600" />}
      </button>

      {/* Logo Header */}
      <div className="flex items-center px-3 pt-6 pb-0">
        <img
          src={Logo}
          alt="Logo"
          onClick={() => setCollapsed(!collapsed)}
          className="h-[44px] w-[44px] rounded-full flex-shrink-0 cursor-pointer hover:bg-gray-100 p-1 transition"
          aria-label="Toggle Sidebar"
        />
        {!collapsed && (
          <div className="ml-4">
            <h1 className="font-semibold text-lg leading-tight">
              <span className="text-red-950">Keel</span>
              <span className="text-custom-gradient">Compass</span>
            </h1>
            <p className="text-gray-500 text-sm">Knowledge Base</p>
          </div>
        )}
      </div>

      {/* 24px Spacer */}
      <div className="h-6" />

      {/* Menu Items */}
      <div className="flex-1 px-3 space-y-2">
        {menuItems.map((item, index) => (
          <Link
            key={index}
            to={item.path}
            className={`flex items-center h-[44px] px-3 rounded-md ${
              collapsed ? "justify-center" : ""
            } ${
              location.pathname === item.path
                ? "bg-custom-gradient text-white"
                : "text-gray-700 hover:bg-custom-sidebar-hover-bg hover:text-teal-500"
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {!collapsed && <span className="ml-3 text-base font-medium">{item.name}</span>}
          </Link>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="mt-auto px-3">
        {/* KeelLearn Button */}
        <div className={`flex items-center h-[44px] px-3 ${collapsed ? "justify-center" : ""} text-gray-600 hover:text-purple-500`}>
          <span className="text-xl"><GiOpenBook /></span>
          {!collapsed && (
            <span className="ml-3 text-base font-medium">
              KeelLearn <span className="text-purple-500">↗</span>
            </span>
          )}
        </div>

        {/* 24px Spacer */}
        <div className="h-6" />

        {/* Logout Button */}
        <div className="flex justify-center mb-6">
          {collapsed ? (
            <button
              onClick={handleLogout}
              className="p-2 text-red-500 hover:bg-red-100 rounded-full transition-colors duration-300"
              aria-label="Logout"
            >
              <BsBoxArrowLeft className="text-xl" />
            </button>
          ) : (
            <button
              onClick={handleLogout}
              className="w-full max-w-[180px] border border-red-500 text-red-500 py-2 rounded-lg shadow-md transition-all duration-300 hover:bg-red-500 hover:text-white hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
