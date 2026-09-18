// frontend\src\features\dashboard\Sidebar.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BsChevronBarLeft, BsChevronBarRight } from "react-icons/bs";
import { IoClose } from "react-icons/io5";
import { FiBookmark, FiHome } from "react-icons/fi";
import Logo from "../../assets/logo.png";
import Tooltip from "../../components/ui/Tooltip";
import type { Theme } from "../../utils/theme";

const TOGGLE_TEAL = "#0E8B87";

function Sidebar({
  showAsk,
  onHomeClick,
  mobileOpen = false,
  onMobileClose,
  theme = "light",
}: {
  showAsk?: boolean;
  questionTitle?: string;
  onHomeClick?: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
  theme?: Theme;
}) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const isDark = theme === "dark";

  const menuItems = [
    {
      name: "Home",
      iconType: "home" as const,
      path: "/dashboard",
      disabled: false,
    },
    {
      name: "My Interests",
      iconType: "interests" as const,
      path: "/interests",
      disabled: false,
    },
  ];

  return (
    <>
      {/* === Mobile backdrop === */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={onMobileClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 overflow-visible flex flex-col h-screen transition-transform duration-300 ease-in-out bg-[#EFEFEF] dark:bg-[#1A1D1F] shadow-md w-[240px] ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } lg:static lg:z-auto lg:translate-x-0 lg:transition-all ${
          collapsed ? "lg:w-[76px]" : "lg:w-[240px]"
        } font-lato`}
      >
        {/* === Mobile close button === */}
        <button
          onClick={onMobileClose}
          aria-label="Close menu"
          className="absolute top-[15px] right-[15px] z-10 flex items-center justify-center w-[26px] h-[26px] rounded-full bg-white dark:bg-gray-700 border border-[#F4F4F4] dark:border-gray-600 shadow-sm lg:hidden"
        >
          <IoClose size={16} color={TOGGLE_TEAL} />
        </button>

        {/* === Chevron Toggle (desktop collapse, hidden on mobile drawer) === */}
        <Tooltip
          text={collapsed ? "Expand menu" : "Collapse menu"}
          position="right-bottom"
          className="hidden lg:block"
        >
          <button
            onClick={() => setCollapsed(!collapsed)}
            aria-label="Toggle sidebar"
            className="
      absolute top-[15px] right-[-15px] z-10
      flex items-center justify-center
      w-[26px] h-[26px]
      rounded-full transition-all duration-200
      bg-white border border-[#F4F4F4] shadow-sm

      hover:bg-[#EDF2F2] hover:border-[#E8F4F5]

      active:bg-[#C8E9E9] active:border-[#D2EEF0]

      focus:outline-none
      focus:bg-white focus:border-[#F4F4F4]
      focus:shadow-[0_0_0_2px_#007C88,0_6px_8px_0_#4141410F]
    "
          >
            {collapsed ? (
              <BsChevronBarRight size={14} color={TOGGLE_TEAL} />
            ) : (
              <BsChevronBarLeft size={14} color={TOGGLE_TEAL} />
            )}
          </button>
        </Tooltip>

        {/* === Logo Section === */}
        <div
          className={`flex items-center ${
            collapsed ? "lg:justify-center" : ""
          } px-[12px] pt-[24px]`}
        >
          <img
            src={Logo}
            alt="Logo"
            className={`${
              collapsed ? "lg:h-[40px] lg:w-[40px]" : ""
            } h-[48px] w-[48px] shrink-0 object-contain`}
          />
          <div
            className={`ml-[8px] leading-tight ${
              collapsed ? "lg:hidden" : ""
            }`}
          >
            <h1 className="text-[18px] font-semibold text-[#212121] dark:text-gray-100">
              KCompass
            </h1>
            <p className="text-[13px] text-[#825E8C] dark:text-[#C9A8D6]">
              Knowledge Base
            </p>
          </div>
        </div>

      {/* === Menu Section === */}
      <nav className="mt-[32px] flex-1 px-[12px]">
        {menuItems.map((item, i) => {
          const selected = location.pathname === item.path && !showAsk;
          const isDisabled = item.disabled;
          const isHome = item.name === "Home";
          const [isHovered, setIsHovered] = useState(false);
          const [isPressed, setIsPressed] = useState(false);
          const [isFocused, setIsFocused] = useState(false);

          // === Dynamic colors per state ===
          const getStateStyles = () => {
            if (isFocused)
              return isDark
                ? { bg: "#123B3D", border: "1.5px solid #4FD1D9", text: "#E5F6F6", iconBorder: "#E5F6F6", fontWeight: 600 }
                : { bg: "#C8E9E9", border: "1.5px solid #007C88", text: "#414141", iconBorder: "#414141", fontWeight: 600 };
            if (selected)
              return isDark
                ? { bg: "#123B3D", border: "none", text: "#8FE3D9", iconBorder: "#8FE3D9", fontWeight: 600 }
                : { bg: "#C8E9E9", border: "none", text: "#53385A", iconBorder: "#53385A", fontWeight: 600 };
            if (isPressed)
              return isDark
                ? { bg: "#0F2E2E", border: "1px solid #17403F", text: "#CBD5D6", iconBorder: "#CBD5D6", fontWeight: 400 }
                : { bg: "#DCF1F1", border: "1px solid #D3EEEE", text: "#404955", iconBorder: "#404955", fontWeight: 400 };
            if (isHovered)
              return isDark
                ? { bg: "#152F2F", border: "1px solid #1D3B3B", text: "#5FD9DC", iconBorder: "#5FD9DC", fontWeight: 500, boxShadow: "none" }
                : { bg: "#DFE6E6", border: "1px solid #E8F0F0", text: "#007C88", iconBorder: "#007C88", fontWeight: 500, boxShadow: "0px 0px 2px 0px #21212114" };

            return isDark
              ? { bg: "transparent", border: "none", text: "#B0B8BA", iconBorder: "#B0B8BA", fontWeight: 400 }
              : { bg: "transparent", border: "none", text: "#404955", iconBorder: "#404955", fontWeight: 400 };
          };

          const state = getStateStyles();

          // Menu item content - identical to original
          const menuItemElement = (
            <div
              tabIndex={isDisabled ? -1 : 0}
              aria-current={selected ? "page" : undefined}
              className={`group relative flex items-center rounded-[6px] h-[44px] mb-[8px] transition-all duration-150 cursor-pointer
                ${collapsed ? "justify-center px-0" : "px-[12px]"}
                ${isDisabled ? "opacity-50 pointer-events-none" : ""}
                ${selected ? "bg-[#C8E9E9]" : "hover:bg-[#DFE6E6]"}
              `}
              style={{
                background: state.bg,
                border: state.border,
                boxShadow: state.boxShadow || "none",
              }}
              onClick={() => {
                if (!isDisabled) {
                  if (isHome && showAsk && onHomeClick) {
                    onHomeClick();
                  } else {
                    navigate(item.path);
                  }
                  onMobileClose?.();
                }
              }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => {
                setIsHovered(false);
                setIsPressed(false);
              }}
              onMouseDown={() => setIsPressed(true)}
              onMouseUp={() => setIsPressed(false)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (!isDisabled) {
                    if (isHome && showAsk && onHomeClick) {
                      onHomeClick();
                    } else {
                      navigate(item.path);
                    }
                    onMobileClose?.();
                  }
                }
              }}
            >
              {/* === Icon === */}
              <div
                className={`relative flex items-center justify-center min-w-[20px] h-[20px] ${
                  collapsed ? "" : "mr-[8px]"
                }`}
              >
                {item.iconType === "home" ? (
                  <FiHome size={18} color={state.iconBorder} />
                ) : (
                  <FiBookmark size={18} color={state.iconBorder} />
                )}
              </div>

              {/* === Text === */}
              {!collapsed && (
                <span
                  style={{
                    color: state.text,
                    fontFamily: "Lato",
                    fontWeight: state.fontWeight,
                    fontSize: "18px",
                    lineHeight: "10px",
                    letterSpacing: isHovered ? "1%" : "normal",
                    opacity: 1,
                    transition: "all 0.15s ease-in-out",
                  }}
                >
                  {item.name}
                </span>
              )}
            </div>
          );

          // Only wrap with Tooltip when sidebar is collapsed
          if (collapsed) {
            return (
              <Tooltip
                key={i}
                text={item.name}
                position="right"
                className="block"
              >
                {menuItemElement}
              </Tooltip>
            );
          }

          return <div key={i}>{menuItemElement}</div>;
        })}
      </nav>
      </aside>
    </>
  );
}

export default Sidebar;
