import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FaRegThumbsUp } from "react-icons/fa";
import { REACTION_META, REACTION_TYPES, ReactionType } from "../../utils/reactions";
import { UserActionType } from "../../utils/types";

interface BurstParticle {
  key: number;
  emoji: string;
  tx: number;
  ty: number;
  rot: number;
  delay: number;
}

// a small emoji burst fired whenever a reaction is newly picked (not on
// removal) - no new dependency, just a handful of emoji animated outward via
// a CSS keyframe (see "confetti-burst" in tailwind.config.js) driven by
// per-particle CSS custom properties set from randomized trajectories.
// Each reaction gets its own emoji/count/spread so they don't all feel the
// same, but they share this one mechanism rather than a bespoke one each.
function makeBurstParticles(emojis: string[], count: number, distanceRange: [number, number]): BurstParticle[] {
  const [minDistance, maxDistance] = distanceRange;
  return Array.from({ length: count }, (_, i) => {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    const distance = minDistance + Math.random() * (maxDistance - minDistance);
    return {
      key: i,
      emoji: emojis[i % emojis.length],
      tx: Math.cos(angle) * distance,
      ty: Math.sin(angle) * distance - 10,
      rot: (Math.random() - 0.5) * 240,
      delay: Math.random() * 60,
    };
  });
}

const BURST_CONFIG: Partial<Record<ReactionType, { emojis: string[]; count: number; distanceRange: [number, number] }>> = {
  [UserActionType.Like]: { emojis: ["👍"], count: 5, distanceRange: [14, 24] },
  [UserActionType.Celebrate]: { emojis: ["🎉", "✨", "🎊"], count: 8, distanceRange: [28, 46] },
  [UserActionType.Insightful]: { emojis: ["💡", "✨"], count: 6, distanceRange: [22, 34] },
  [UserActionType.Curious]: { emojis: ["🤔", "❓"], count: 6, distanceRange: [18, 30] },
};

interface HeartParticle {
  key: number;
  emoji: string;
  dx: number;
  delay: number;
}

const HEART_EMOJI = ["❤️", "💕", "💗"];

// Love gets its own upward-drifting-and-fading motion instead of a radial
// burst - the classic "double-tap like" heart-float feel, which reads more
// like affection than a generic celebration burst would.
function makeHeartParticles(): HeartParticle[] {
  return Array.from({ length: 5 }, (_, i) => ({
    key: i,
    emoji: HEART_EMOJI[i % HEART_EMOJI.length],
    dx: (Math.random() - 0.5) * 36,
    delay: Math.random() * 120,
  }));
}

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
  const [burstParticles, setBurstParticles] = useState<BurstParticle[] | null>(null);
  const [heartParticles, setHeartParticles] = useState<HeartParticle[] | null>(null);
  const [ripples, setRipples] = useState<number[]>([]);

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

  // fires the reaction-specific micro-animation - only called for a type
  // that's being newly applied, never for a removal, so clicking an already
  // -active reaction off stays quiet
  const triggerEffectFor = (type: ReactionType) => {
    const burstConfig = BURST_CONFIG[type];
    if (burstConfig) {
      setBurstParticles(makeBurstParticles(burstConfig.emojis, burstConfig.count, burstConfig.distanceRange));
      setTimeout(() => setBurstParticles(null), 750);
      return;
    }
    if (type === UserActionType.Love) {
      setHeartParticles(makeHeartParticles());
      setTimeout(() => setHeartParticles(null), 950);
      return;
    }
    if (type === UserActionType.Support) {
      const id = Date.now() + Math.random();
      setRipples((prev) => [...prev, id]);
      setTimeout(() => setRipples((prev) => prev.filter((r) => r !== id)), 650);
    }
  };

  const handleMainClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (suppressClickRef.current) {
      // this click was synthesized by the touchend that just opened the
      // picker via long-press - don't also toggle the reaction underneath it
      suppressClickRef.current = false;
      return;
    }
    const type = myReaction ?? REACTION_TYPES[0];
    if (type !== myReaction) triggerEffectFor(type);
    onReact(type);
  };

  const handlePick = (e: React.MouseEvent, type: ReactionType) => {
    e.stopPropagation();
    if (type !== myReaction) triggerEffectFor(type);
    onReact(type);
    clearTimers();
    closePicker();
  };

  const iconSize = size === "md" ? 15 : 13;
  const safeCount = typeof totalCount === "number" && !isNaN(totalCount) ? totalCount : 0;
  const activeMeta = myReaction ? REACTION_META[myReaction] : null;

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

      {burstParticles && (
        <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
          {burstParticles.map((p) => (
            <span
              key={p.key}
              className="absolute left-1/2 top-1/2 text-sm animate-confetti-burst"
              style={
                {
                  "--confetti-tx": `${p.tx}px`,
                  "--confetti-ty": `${p.ty}px`,
                  "--confetti-rot": `${p.rot}deg`,
                  animationDelay: `${p.delay}ms`,
                } as React.CSSProperties
              }
            >
              {p.emoji}
            </span>
          ))}
        </div>
      )}

      {heartParticles && (
        <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
          {heartParticles.map((p) => (
            <span
              key={p.key}
              className="absolute left-1/2 top-1/2 text-sm animate-heart-float"
              style={{ "--heart-drift": `${p.dx}px`, animationDelay: `${p.delay}ms` } as React.CSSProperties}
            >
              {p.emoji}
            </span>
          ))}
        </div>
      )}

      {ripples.length > 0 && (
        <div className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
          {ripples.map((id) => (
            <span
              key={id}
              className="absolute left-1/2 top-1/2 w-6 h-6 -ml-3 -mt-3 rounded-full border-2 border-brand-500 dark:border-teal-400 animate-ripple-pulse"
            />
          ))}
        </div>
      )}

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
            {REACTION_TYPES.map((type) => {
              const count = reactionCounts?.[type] ?? 0;
              return (
                <button
                  key={type}
                  type="button"
                  role="menuitem"
                  aria-label={count > 0 ? `${REACTION_META[type].label}, ${count}` : REACTION_META[type].label}
                  title={REACTION_META[type].label}
                  onClick={(e) => handlePick(e, type)}
                  className={`flex flex-col items-center gap-0 px-1.5 py-1 rounded-xl transition-transform duration-100 hover:scale-125 hover:bg-gray-100 dark:hover:bg-white/10 ${
                    myReaction === type ? "bg-brand-50 dark:bg-teal-900/40" : ""
                  }`}
                >
                  <span className="text-xl leading-none">{REACTION_META[type].emoji}</span>
                  {count > 0 && (
                    <span className="text-[10px] leading-none text-gray-500 dark:text-gray-400 mt-0.5">
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>,
          document.body
        )}
    </div>
  );
}

export default ReactionButton;
