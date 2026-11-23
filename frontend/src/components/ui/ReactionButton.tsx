import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaRegThumbsUp } from "react-icons/fa";
import { REACTION_META, REACTION_TYPES, ReactionType } from "../../utils/reactions";

interface ReactionButtonProps {
  myReaction: ReactionType | null;
  reactionCounts?: Partial<Record<ReactionType, number>>;
  totalCount: number;
  onReact: (type: ReactionType) => void;
  size?: "sm" | "md";
}

const SHOW_DELAY = 400; // ms before the reaction picker appears on hover
const HIDE_DELAY = 200; // ms before it disappears after the pointer leaves
const LONG_PRESS_DELAY = 450; // ms of holding a touch before the picker opens

// Animates with a little pop whenever the active reaction flips, instead of
// the icon/color just snapping between states. Clicking the button body
// toggles the current (or default) reaction; hovering (desktop) or
// long-pressing (touch) reveals the full picker row, mirroring Tooltip's
// portal-positioning pattern since this needs to spill out past scroll
// containers the same way.
function ReactionButton({
  myReaction,
  reactionCounts,
  totalCount,
  onReact,
  size = "sm",
}: ReactionButtonProps) {
  const [popping, setPopping] = useState(false);
  const isFirstRender = useRef(true);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const suppressClickRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPopping(true);
    const timer = setTimeout(() => setPopping(false), 400);
    return () => clearTimeout(timer);
  }, [myReaction]);

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
    const GAP = 10;
    setCoords({ top: rect.top - GAP, left: rect.left + rect.width / 2 });
  }, []);

  const openPicker = useCallback(() => {
    computeCoords();
    setShouldRender(true);
    setIsVisible(true);
  }, [computeCoords]);

  const closePicker = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => setShouldRender(false), 150);
  }, []);

  const showPicker = useCallback(() => {
    clearTimers();
    showTimerRef.current = setTimeout(openPicker, SHOW_DELAY);
  }, [clearTimers, openPicker]);

  const hidePicker = useCallback(() => {
    clearTimers();
    hideTimerRef.current = setTimeout(closePicker, HIDE_DELAY);
  }, [clearTimers, closePicker]);

  const handlePickerMouseEnter = useCallback(() => {
    clearTimers();
  }, [clearTimers]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    longPressTimerRef.current = setTimeout(() => {
      suppressClickRef.current = true;
      openPicker();
    }, LONG_PRESS_DELAY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current || !longPressTimerRef.current) return;
    const dx = Math.abs(e.touches[0].clientX - touchStartRef.current.x);
    const dy = Math.abs(e.touches[0].clientY - touchStartRef.current.y);
    if (dx > 10 || dy > 10) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
      longPressTimerRef.current = null;
    }
  };

  // Close on Escape, or on a click/tap outside both the button and the
  // portaled picker - needed for touch devices, which have no "mouse leave".
  useEffect(() => {
    if (!shouldRender) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closePicker();
    };
    const handleOutside = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      if (containerRef.current?.contains(target)) return;
      closePicker();
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
    };
  }, [shouldRender, closePicker]);

  useEffect(() => {
    return () => {
      clearTimers();
      if (longPressTimerRef.current) clearTimeout(longPressTimerRef.current);
    };
  }, [clearTimers]);

  const handleMainClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (suppressClickRef.current) {
      // this click was synthesized by the touchend that just opened the
      // picker via long-press - don't also toggle the reaction underneath it
      suppressClickRef.current = false;
      return;
    }
    onReact(myReaction ?? REACTION_TYPES[0]);
  };

  const handlePick = (e: React.MouseEvent, type: ReactionType) => {
    e.stopPropagation();
    onReact(type);
    clearTimers();
    closePicker();
  };

  const iconSize = size === "md" ? 15 : 13;
  const safeCount = typeof totalCount === "number" && !isNaN(totalCount) ? totalCount : 0;
  const activeMeta = myReaction ? REACTION_META[myReaction] : null;

  const breakdown = reactionCounts
    ? REACTION_TYPES.filter((t) => (reactionCounts[t] ?? 0) > 0)
        .map((t) => `${REACTION_META[t].emoji} ${REACTION_META[t].label}: ${reactionCounts[t]}`)
        .join("\n")
    : undefined;

  return (
    <div
      ref={containerRef}
      className="relative inline-block"
      onMouseEnter={showPicker}
      onMouseLeave={hidePicker}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onContextMenu={(e) => e.preventDefault()}
    >
      <button
        type="button"
        onClick={handleMainClick}
        title={breakdown}
        className={`flex items-center gap-1.5 text-sm select-none transition-colors duration-150 active:scale-95 ${
          myReaction
            ? "text-brand-700 dark:text-teal-300"
            : "text-gray-600 dark:text-gray-300 hover:text-brand-700 dark:hover:text-teal-300"
        }`}
      >
        <span className={`inline-flex ${popping ? "animate-like-pop" : ""}`}>
          {activeMeta ? (
            <span aria-hidden="true" className="text-base leading-none">{activeMeta.emoji}</span>
          ) : (
            <FaRegThumbsUp size={iconSize} />
          )}
        </span>
        <span>
          {safeCount} {safeCount === 1 ? "Reaction" : "Reactions"}
        </span>
      </button>

      {shouldRender &&
        coords &&
        createPortal(
          <div
            role="menu"
            className={`flex items-center gap-0.5 rounded-full bg-white dark:bg-gray-800 shadow-lg border border-gray-100 dark:border-gray-700 px-1.5 py-1 transition-opacity duration-150 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{
              position: "fixed",
              bottom: `calc(100vh - ${coords.top}px)`,
              left: coords.left,
              transform: "translateX(-50%)",
              zIndex: 9999,
            }}
            onMouseEnter={handlePickerMouseEnter}
            onMouseLeave={hidePicker}
          >
            {REACTION_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                role="menuitem"
                aria-label={REACTION_META[type].label}
                title={REACTION_META[type].label}
                onClick={(e) => handlePick(e, type)}
                className={`text-xl leading-none p-1.5 rounded-full transition-transform duration-100 hover:scale-125 hover:bg-gray-100 dark:hover:bg-white/10 ${
                  myReaction === type ? "bg-brand-50 dark:bg-teal-900/40" : ""
                }`}
              >
                {REACTION_META[type].emoji}
              </button>
            ))}
          </div>,
          document.body
        )}
    </div>
  );
}

export default ReactionButton;
