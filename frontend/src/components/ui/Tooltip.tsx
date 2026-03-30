// frontend\src\components\ui\Tooltip.tsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";

type TooltipPosition = "top" | "bottom" | "left" | "right" | "right-bottom";

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
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
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

  const computeCoords = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const GAP = 10; // gap + arrow height

    let top = 0;
    let left = 0;

    switch (position) {
      case "top":
        top = rect.top - GAP;
        left = rect.left + rect.width / 2;
        break;
      case "bottom":
        top = rect.bottom + GAP;
        left = rect.left + rect.width / 2;
        break;
      case "left":
        top = rect.top + rect.height / 2;
        left = rect.left - GAP;
        break;
      case "right":
        top = rect.top + rect.height / 2;
        left = rect.right + GAP;
        break;
      case "right-bottom":
        top = rect.top + 15;
        left = rect.right + 30;
        break;
    }

    setCoords({ top, left });
  }, [position]);

  const showTooltip = useCallback(() => {
    clearTimers();
    showTimerRef.current = setTimeout(() => {
      computeCoords();
      setShouldRender(true);
      setIsVisible(true);
    }, SHOW_DELAY);
  }, [clearTimers, computeCoords]);

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

  const getTooltipStyle = (): React.CSSProperties => {
    if (!coords) return { display: "none" };

    const base: React.CSSProperties = {
      position: "fixed",
      backgroundColor: "#825E8B",
      zIndex: 9999,
    };

    switch (position) {
      case "top":
        return { ...base, bottom: `calc(100vh - ${coords.top}px)`, left: coords.left, transform: "translateX(-50%)" };
      case "bottom":
        return { ...base, top: coords.top, left: coords.left, transform: "translateX(-50%)" };
      case "left":
        return { ...base, top: coords.top, right: `calc(100vw - ${coords.left}px)`, transform: "translateY(-50%)" };
      case "right":
        return { ...base, top: coords.top, left: coords.left, transform: "translateY(-50%)" };
      case "right-bottom":
        return { ...base, top: coords.top, left: coords.left };
    }
  };

  const arrowClasses: Record<TooltipPosition, string> = {
    top: "top-full left-1/2 -translate-x-1/2",
    bottom: "bottom-full left-1/2 -translate-x-1/2",
    left: "left-full top-1/2 -translate-y-1/2",
    right: "right-full top-1/2 -translate-y-1/2",
    "right-bottom": "right-full top-[8px]",
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
    "right-bottom": {
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
      {shouldRender && createPortal(
        <div
          ref={tooltipRef}
          className={`
            py-1 px-2 rounded whitespace-nowrap
            text-white text-sm font-normal
            transition-opacity duration-150
            ${isVisible ? "opacity-100" : "opacity-0"}
          `}
          style={getTooltipStyle()}
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
        </div>,
        document.body
      )}
    </div>
  );
}

export default Tooltip;
