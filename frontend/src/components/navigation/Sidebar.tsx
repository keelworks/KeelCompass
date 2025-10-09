import { useState } from "react";
import { useLocation } from "react-router-dom";
import { BsChevronBarLeft, BsChevronBarRight } from "react-icons/bs";
import Logo from "../../assets/logo.png";
import homelogo from "../../assets/homelogo.png";

const HOME_PURPLE = "#53385A";   // home color (icon + text)
const TOGGLE_TEAL = "#0E8B87";   // chevron color

function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      name: "Home",
      icon: (
        <span
          className="inline-block w-[20px] h-[20px] mr-[8px] bg-[#53385A]"
          style={{
            WebkitMaskImage: `url(${homelogo})`,
            maskImage: `url(${homelogo})`,
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskPosition: "center",
            maskPosition: "center",
          }}
        />
      ),
      path: "/dashboard",
      disabled: false,
    },
  ];

  return (
    <aside
      className={`relative overflow-visible flex flex-col h-screen transition-all duration-300 bg-[#EFEFEF] shadow-md ${
        collapsed ? "w-[76px]" : "w-[240px]"
      }`}
    >
      {/* === Chevron Toggle === */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        aria-label="Toggle sidebar"
        className="
          absolute top-[15px] right-[-15px] z-10
          flex items-center justify-center
          w-[26px] h-[26px]
          rounded-full bg-white border border-[#F4F4F4]
          shadow-sm hover:shadow-[0_2px_6px_rgba(0,0,0,0.08)]
          transition-all duration-300
        "
      >
        {collapsed ? (
          <BsChevronBarRight size={14} color={TOGGLE_TEAL} />
        ) : (
          <BsChevronBarLeft size={14} color={TOGGLE_TEAL} />
        )}
      </button>

      {/* === Logo Section === */}
      <div
        className={`flex items-center ${
          collapsed ? "justify-center" : "px-[12px]"
        } pt-[24px]`}
      >
        <img
          src={Logo}
          alt="Logo"
          className={`${
            collapsed ? "h-[40px] w-[40px]" : "h-[48px] w-[48px]"
          } shrink-0 object-contain`}
        />
        {!collapsed && (
          <div className="ml-[8px] leading-tight">
            <h1 className="text-[18px] font-semibold text-[#212121]">KCompass</h1>
            <p className="text-[13px] text-[#8B8B8B]">Knowledge Base</p>
          </div>
        )}
      </div>

      {/* === Menu Section === */}
      <nav className="mt-[32px] flex-1 px-[12px]">
        {menuItems.map((item, i) => {
          const selected = location.pathname === item.path;
          const isDisabled = item.disabled;

          return (
            <div
              key={i}
              className={`group relative flex items-center rounded-md h-[44px] mb-[8px] transition-all
                ${selected && !isDisabled ? "bg-[#D9F3F0]" : "hover:bg-gray-100"}
                ${collapsed ? "justify-center px-0" : "px-[12px]"}
                ${isDisabled ? "opacity-50 pointer-events-none" : ""}
              `}
            >
              {/* Icon */}
              <div
                className={`flex items-center justify-center min-w-[20px] h-[20px] ${
                  collapsed ? "" : "mr-[8px]"
                }`}
              >
                {item.icon}
              </div>

              {/* Text */}
              {!collapsed && (
                <span
                  className="text-[15px] font-medium leading-[20px]"
                  style={{ color: HOME_PURPLE }}
                >
                  {item.name}
                </span>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

export default Sidebar;
