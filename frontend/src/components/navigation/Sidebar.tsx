import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BsChevronBarLeft, BsChevronBarRight } from "react-icons/bs";
import Logo from "../../assets/logo.png";
import homelogo from "../../assets/homelogo.svg";

const HOME_PURPLE = "#53385A";
const TOGGLE_TEAL = "#0E8B87";
const TIP_BG = "#825E8B";

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

  const [showHomeTip, setShowHomeTip] = useState(false);
  const tipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();

  const menuItems = [
    {
      name: "Home",
      icon: homelogo,
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

          return (
            <MenuItem
              key={i}
              item={item}
              selected={selected}
              isDisabled={isDisabled}
              isHome={isHome}
              collapsed={collapsed}
              showAsk={showAsk}
              onHomeClick={onHomeClick}
              navigate={navigate}
            />
          );
        })}
      </nav>
    </aside>
  );
}

// Separate MenuItem component for cleaner state management
function MenuItem({
  item,
  selected,
  isDisabled,
  isHome,
  collapsed,
  showAsk,
  onHomeClick,
  navigate,
}: {
  item: any;
  selected: boolean;
  isDisabled: boolean;
  isHome: boolean;
  collapsed: boolean;
  showAsk?: boolean;
  onHomeClick?: () => void;
  navigate: any;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Get icon filter based on state (exact Figma colors)
  const getIconFilter = () => {
    if (selected) {
      // Purple #53385A
      return "brightness(0) saturate(100%) invert(17%) sepia(9%) saturate(1462%) hue-rotate(257deg) brightness(94%) contrast(90%)";
    }
    if (isHovered) {
      // Teal #007C88
      return "brightness(0) saturate(100%) invert(34%) sepia(69%) saturate(1573%) hue-rotate(136deg) brightness(92%) contrast(101%)";
    }
    // Default Gray #404955
    return "brightness(0) saturate(100%) invert(26%) sepia(6%) saturate(586%) hue-rotate(174deg) brightness(96%) contrast(88%)";
  };

  // Get text color based on state (exact Figma colors)
  const getTextColor = () => {
    if (isFocused) return "#414141";
    if (selected) return "#53385A";
    if (isHovered) return "#007C88";
    return "#404955";
  };

  // Get font weight based on state
  const getFontWeight = () => {
    if (isFocused || selected) return 600;
    if (isHovered) return 500;
    return 400;
  };

  const handleClick = () => {
    if (!isDisabled) {
      if (isHome && showAsk && onHomeClick) {
        onHomeClick();
      } else {
        navigate(item.path);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      tabIndex={isDisabled ? -1 : 0}
      aria-current={selected ? "page" : undefined}
      aria-label={item.name}
      role="button"
      className={`
        group relative flex items-center rounded-[6px] h-[44px] mb-[8px] 
        transition-all duration-150 cursor-pointer
        ${collapsed ? "justify-center px-0" : "px-[12px]"}
        ${isDisabled ? "opacity-50 pointer-events-none" : ""}
      `}
      style={{
        // Background colors (exact Figma values)
        background:
          isFocused || selected
            ? "#C8E9E9"
            : isPressed
            ? "#DCF1F1"
            : isHovered
            ? "#DFE6E6"
            : "transparent",

        // Borders (exact Figma values)
        border: isFocused
          ? "1.5px solid #007C88"
          : isPressed
          ? "1px solid #D3EEEE"
          : isHovered
          ? "1px solid #E8F0F0"
          : "none",

        // Shadow (only on hover, exact Figma value)
        boxShadow:
          isHovered && !isPressed && !isFocused
            ? "0px 0px 2px 0px rgba(33, 33, 33, 0.08)"
            : "none",
      }}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsPressed(false);
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      onKeyDown={handleKeyDown}
    >
      {/* === Icon === */}
      <div
        className={`relative flex items-center justify-center min-w-[20px] h-[20px] ${
          collapsed ? "" : "mr-[8px]"
        }`}
      >
        <img
          src={item.icon}
          alt={item.name}
          className="transition-all duration-150"
          style={{
            width: "16.4px",
            height: "18px",
            filter: getIconFilter(),
          }}
        />
      </div>

      {/* === Text === */}
      {!collapsed && (
        <span
          className="transition-all duration-150"
          style={{
            color: getTextColor(),
            fontFamily: "Lato",
            fontWeight: getFontWeight(),
            fontSize: "18px",
            lineHeight: "10px",
            letterSpacing: isHovered ? "0.01em" : "normal",
          }}
        >
          {item.name}
        </span>
      )}
    </div>
  );
}

export default Sidebar;
