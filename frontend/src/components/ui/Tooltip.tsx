import React, { useState, useRef, useEffect } from "react";

type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  text: string;
  position?: TooltipPosition;
  children: React.ReactNode;
}

function Tooltip({ text, position = "top", children }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const positionClasses: Record<TooltipPosition, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  const arrowClasses: Record<TooltipPosition, string> = {
    top: "top-full left-1/2 -translate-x-1/2",
    bottom: "bottom-full left-1/2 -translate-x-1/2",
    left: "left-full top-1/2 -translate-y-1/2",
    right: "right-full top-1/2 -translate-y-1/2",
  };

  const arrowStyles: Record<TooltipPosition, React.CSSProperties> = {
    top: {
      borderLeft: "6px solid transparent",
      borderRight: "6px solid transparent",
      borderTop: "6px solid #825E8B",
    },
    bottom: {
      borderLeft: "6px solid transparent",
      borderRight: "6px solid transparent",
      borderBottom: "6px solid #825E8B",
    },
    left: {
      borderTop: "6px solid transparent",
      borderBottom: "6px solid transparent",
      borderLeft: "6px solid #825E8B",
    },
    right: {
      borderTop: "6px solid transparent",
      borderBottom: "6px solid transparent",
      borderRight: "6px solid #825E8B",
    },
  };

  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      onFocus={() => setIsVisible(true)}
      onBlur={() => setIsVisible(false)}
    >
      {children}
      <div
        ref={tooltipRef}
        className={`
          absolute ${positionClasses[position]}
          px-2 py-1 rounded whitespace-nowrap
          text-white text-sm font-normal
          transition-opacity duration-150
          pointer-events-none z-50
          ${isVisible ? "opacity-100" : "opacity-0"}
        `}
        style={{ backgroundColor: "#825E8B" }}
        role="tooltip"
        aria-hidden={!isVisible}
      >
        {text}
        <div
          className={`absolute w-0 h-0 ${arrowClasses[position]}`}
          style={arrowStyles[position]}
        />
      </div>
    </div>
  );
}

export default Tooltip;
