import { useState } from "react";
import { useLocation } from "react-router-dom";
import { BsHouseDoor } from "react-icons/bs";
import { FaBook } from "react-icons/fa";
import { RiQuestionnaireLine } from "react-icons/ri";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import Logo from "../../assets/logo.png";

function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      name: "Dashboard",
      icon: <BsHouseDoor />,
      path: "/dashboard",
      disabled: false,
    },
    {
      name: "Q&A Discussions",
      icon: <RiQuestionnaireLine />,
      path: "/qna",
      disabled: true, // Disabled for now
    },
  ];

  return (
    <div
      className={`relative flex flex-col h-screen transition-all duration-300 bg-white shadow-md ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Collapse/Expand Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute top-6 -right-3 z-10 bg-white border border-gray-300 rounded-full p-1 shadow"
        aria-label="Toggle Sidebar"
      >
        {collapsed ? <FiChevronRight size={16} /> : <FiChevronLeft size={16} />}
      </button>

      {/* Logo and Title */}
      <div
        className={`flex items-center px-3 ${
          collapsed ? "justify-center pt-6" : "pt-6 pl-4"
        }`}
      >
        <img
          src={Logo}
          alt="Logo"
          className="h-10 w-10 rounded-full cursor-pointer hover:bg-gray-100 p-1"
        />
        {!collapsed && (
          <div className="ml-3">
            <h1 className="text-[16px] font-semibold leading-5">
              <span className="text-red-950">Keel</span>
              <span className="text-custom-gradient">Compass</span>
            </h1>
            <p className="text-sm text-gray-500 leading-4 mt-1">
              Knowledge Base
            </p>
          </div>
        )}
      </div>

      {/* Menu Items */}
      <div className="mt-6 flex-1 px-[12px]">
        {menuItems.map((item, index) => {
          const selected = location.pathname === item.path;
          const isDisabled = item.disabled;

          return (
            <div
              key={index}
              className={`relative flex items-center rounded-md h-[44px] mb-2 transition-all ${
                selected && !isDisabled
                  ? "bg-custom-gradient text-white font-medium"
                  : "text-[#525252] hover:text-teal-600 hover:bg-gray-100"
              } ${collapsed ? "justify-center px-0" : "px-[12px]"} ${
                isDisabled ? "opacity-50 pointer-events-none" : ""
              }`}
            >
              <div
                className={`flex items-center justify-center min-w-[44px] h-[44px] rounded-md ${
                  collapsed ? "" : "mr-[8px]"
                }`}
              >
                <span className="text-xl">{item.icon}</span>
              </div>

              {!collapsed && (
                <span className="text-sm font-medium">{item.name}</span>
              )}
            </div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 mx-[12px] my-[12px]" />

      {/* KeelLearn Section */}
      <div
        className={`relative flex items-center rounded-md h-[44px] mb-2 transition-all text-[#525252]  hover:bg-gray-100 cursor-pointer ${
          collapsed ? "justify-center px-0" : "px-[12px]"
        }`}
      >
        <div
          className={`flex items-center justify-center min-w-[44px] h-[44px] rounded-md ${
            collapsed ? "" : "mr-[8px]"
          }`}
        >
          <FaBook className="text-xl" style={{ color: "#865c90" }} />
        </div>

        {!collapsed && (
          <span className="text-sm font-medium">
            KeelLearn <span>↗</span>
          </span>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
