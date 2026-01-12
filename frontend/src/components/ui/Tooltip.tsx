// frontend\src\components\ui\Tooltip.tsx
import React, { useState, useRef, useEffect, useCallback } from "react";

type TooltipPosition = "top" | "bottom" | "left" | "right";

interface TooltipProps {
  text: string;
  position?: TooltipPosition;
  children: React.ReactNode;
  className?: string;
}

const SHOW_DELAY = 300; // ms before tooltip appears
const HIDE_DELAY = 200; // ms before tooltip disappears

function Tooltip({
  text,
  position = "top",
  children,
  className = "",
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const clearTimers = useCallback(() => {
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
    if (hideTimerRef.current) {
      clearTimeout(hideTimerRef.current);
      hideTimerRef.current = null;
    }
  }, []);

  const showTooltip = useCallback(() => {
    clearTimers();
    showTimerRef.current = setTimeout(() => {
      setShouldRender(true);
      setIsVisible(true);
    }, SHOW_DELAY);
  }, [clearTimers]);

  const hideTooltip = useCallback(() => {
    clearTimers();
    hideTimerRef.current = setTimeout(() => {
      setIsVisible(false);
      // Delay removing from DOM to allow fade out
      setTimeout(() => setShouldRender(false), 150);
    }, HIDE_DELAY);
  }, [clearTimers]);

  const handleMouseEnterTooltip = useCallback(() => {
    // Keep tooltip visible when hovering over it
    clearTimers();
  }, [clearTimers]);

  const handleMouseLeaveTooltip = useCallback(() => {
    hideTooltip();
  }, [hideTooltip]);

  // Handle Esc key to dismiss tooltip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isVisible) {
        clearTimers();
        setIsVisible(false);
        setTimeout(() => setShouldRender(false), 150);
      }
    };

    if (isVisible) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, clearTimers]);

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  // Position classes with 4px gap (carrot tip to target edge)
  // Total offset = 4px gap + 6px arrow height = 10px
  const positionClasses: Record<TooltipPosition, string> = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-[10px]",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-[10px]",
    left: "right-full top-1/2 -translate-y-1/2 mr-[10px]",
    right: "left-full top-1/2 -translate-y-1/2 ml-[10px]",
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
      ref={containerRef}
      className={`relative ${className}`}
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
      onFocus={showTooltip}
      onBlur={hideTooltip}
    >
      {children}
      {shouldRender && (
        <div
          ref={tooltipRef}
          className={`
            absolute ${positionClasses[position]}
            py-1 px-2 rounded whitespace-nowrap
            text-white text-sm font-normal
            transition-opacity duration-150
            z-50
            ${isVisible ? "opacity-100" : "opacity-0"}
          `}
          style={{ backgroundColor: "#825E8B" }}
          role="tooltip"
          aria-hidden={!isVisible}
          onMouseEnter={handleMouseEnterTooltip}
          onMouseLeave={handleMouseLeaveTooltip}
        >
          {text}
          {/* Arrow/Carrot - centered to target */}
          <div
            className={`absolute w-0 h-0 ${arrowClasses[position]}`}
            style={arrowStyles[position]}
          />
        </div>
      )}
    </div>
  );
}

export default Tooltip;
