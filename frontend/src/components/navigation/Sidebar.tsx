// frontend\src\features\dashboard\Sidebar.tsx
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BsChevronBarLeft, BsChevronBarRight } from "react-icons/bs";
import Logo from "../../assets/logo.png";
import homelogo from "../../assets/homelogo.svg";
import Tooltip from "../../components/ui/Tooltip";

const TOGGLE_TEAL = "#0E8B87";

function Sidebar({
  showAsk,
  questionTitle,
  onHomeClick,
}: {
  showAsk?: boolean;
  questionTitle?: string;
  onHomeClick?: () => void;
}) {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Home",
      icon: (
        <img
          src={homelogo}
          alt="Home"
          className="w-[20px] h-[20px]"
          style={{
            filter: `invert(17%) sepia(9%) saturate(1462%) hue-rotate(257deg) brightness(94%) contrast(90%)`,
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
      } font-lato`}
    >
      {/* === Chevron Toggle === */}
      <Tooltip
        text={collapsed ? "Expand menu" : "Collapse menu"}
        position="right-bottom"
        className="block"
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
            <h1 className="text-[18px] font-semibold text-[#212121]">
              KCompass
            </h1>
            <p className="text-[13px]" style={{ color: "#825E8C" }}>
              Knowledge Base
            </p>
          </div>
        )}
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
              return {
                bg: "#C8E9E9",
                border: "1.5px solid #007C88",
                text: "#414141",
                iconBorder: "#414141",
                fontWeight: 600,
              };
            if (selected)
              return {
                bg: "#C8E9E9",
                border: "none",
                text: "#53385A",
                iconBorder: "#53385A",
                fontWeight: 600,
              };
            if (isPressed)
              return {
                bg: "#DCF1F1",
                border: "1px solid #D3EEEE",
                text: "#404955",
                iconBorder: "#404955",
                fontWeight: 400,
              };
            if (isHovered)
              return {
                bg: "#DFE6E6",
                border: "1px solid #E8F0F0",
                text: "#007C88",
                iconBorder: "#007C88",
                fontWeight: 500,
                boxShadow: "0px 0px 2px 0px #21212114",
              };

            return {
              bg: "transparent",
              border: "none",
              text: "#404955",
              iconBorder: "#404955",
              fontWeight: 400,
            };
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
                <img
                  src={homelogo}
                  alt="Home"
                  style={{
                    width: "16.4px",
                    height: "18px",
                    opacity: 1,
                    filter: selected
                      ? "invert(17%) sepia(9%) saturate(1462%) hue-rotate(257deg) brightness(94%) contrast(90%)"
                      : isHovered
                      ? "brightness(0) saturate(100%) invert(34%) sepia(69%) saturate(1573%) hue-rotate(136deg) brightness(92%) contrast(101%)"
                      : "brightness(0) saturate(100%) invert(26%) sepia(6%) saturate(586%) hue-rotate(174deg) brightness(96%) contrast(88%)",
                  }}
                />
              </div>

              {/* === Text === */}
              {!collapsed && (
                <span
                  style={{
                    color: selected
                      ? "#53385A"
                      : isHovered
                      ? "#007C88"
                      : "#404955",
                    fontFamily: "Lato",
                    fontWeight: selected ? 600 : isHovered ? 500 : 400,
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
  );
}

export default Sidebar;
