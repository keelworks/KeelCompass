import { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import { BsChevronBarLeft, BsChevronBarRight } from "react-icons/bs";
import Logo from "../../assets/logo.png";
import homelogo from "../../assets/homelogo.png";

const HOME_PURPLE = "#53385A";
const TOGGLE_TEAL = "#0E8B87";
const TIP_BG = "#825E8B";

function Sidebar() {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const [showHomeTip, setShowHomeTip] = useState(false);
  const tipTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const menuItems = [
    {
      name: "Home",
      icon: (
        <span
          className="inline-block w-[20px] h-[20px] bg-[#53385A]" // removed mr-[8px]
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
          const selected = location.pathname === item.path;
          const isDisabled = item.disabled;

          const isHome = item.name === "Home";

          return (
            <div
              key={i}
              /* make the item focusable for keyboard users */
              tabIndex={isDisabled ? -1 : 0}
              aria-current={selected ? "page" : undefined}
              className={`group relative flex items-center rounded-md h-[44px] mb-[8px] transition-all
    ${selected && !isDisabled ? "bg-[#D9F3F0]" : "hover:bg-gray-100"}
    ${collapsed ? "justify-center px-0" : "px-[12px]"}
    ${isDisabled ? "opacity-50 pointer-events-none" : ""}
    /* === Focused state (from Figmas): bg #C8E9E9 + teal border === */
    focus:outline-none
    focus:bg-[#C8E9E9]
    focus:shadow-[0_0_0_2px_#007C88]
    focus-visible:outline-none
    focus-visible:bg-[#C8E9E9]
    focus-visible:shadow-[0_0_0_2px_#007C88]
  `}
              onMouseEnter={() => {
                if (isHome && collapsed) {
                  tipTimer.current = setTimeout(
                    () => setShowHomeTip(true),
                    300
                  );
                }
              }}
              onMouseLeave={() => {
                if (isHome) {
                  if (tipTimer.current) clearTimeout(tipTimer.current);
                  setShowHomeTip(false);
                }
              }}
            >
              {/* Icon*/}
              <div
                className={`relative flex items-center justify-center min-w-[20px] h-[20px] ${
                  collapsed ? "" : "mr-[8px]"
                }`}
              >
                {item.icon}

                {/* === Tooltip for Home === */}
                {isHome && showHomeTip && collapsed && (
                  <div
                    className="
absolute top-1/2 -translate-y-1/2 left-[calc(100%+25px)] /* ⬅️ was left-[calc(100%+4px)] */
    z-50 flex items-center justify-center gap-[10px]
    w-[54px] h-[26px] px-[8px] py-[8px]
    rounded-[4px] opacity-100 whitespace-nowrap
  "
                    style={{ background: TIP_BG }}
                  >
                    <span className="text-white text-[13px] leading-[14px] font-medium">
                      Home
                    </span>

                    {/* Carrot (centered to icon; 4px gap is set by bottom calc above) */}
                    <span
                      className="absolute top-1/2 -translate-y-1/2"
                      style={{
                        right: "100%", // ⬅️ was right: "100%"
                        width: 0,
                        height: 0,
                        borderTop: "6px solid transparent",
                        borderBottom: "6px solid transparent",
                        borderRight: `6px solid ${TIP_BG}`, // ⬅️ was borderRight
                      }}
                    />
                  </div>
                )}
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
