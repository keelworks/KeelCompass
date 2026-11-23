import { useLayoutEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MentionUser } from "../../utils/store";

interface MentionDropdownProps {
  anchorRef: React.RefObject<HTMLElement>;
  results: MentionUser[];
  activeIndex: number;
  onHover: (index: number) => void;
  onSelect: (user: MentionUser) => void;
}

// Floating @mention suggestion list. Portaled to document.body (like
// Tooltip.tsx) so it can spill out past a scrollable popup/modal instead of
// being clipped at its edge - anchored to the input's live bounding rect.
function MentionDropdown({ anchorRef, results, activeIndex, onHover, onSelect }: MentionDropdownProps) {
  const [coords, setCoords] = useState<{ top: number; left: number; width: number } | null>(null);

  useLayoutEffect(() => {
    if (results.length === 0 || !anchorRef.current) return;

    const updatePosition = () => {
      const rect = anchorRef.current?.getBoundingClientRect();
      if (!rect) return;
      setCoords({ top: rect.bottom + 4, left: rect.left, width: rect.width });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [results.length, anchorRef]);

  if (results.length === 0 || !coords) return null;

  return createPortal(
    <div
      style={{ position: "fixed", top: coords.top, left: coords.left, width: Math.max(coords.width, 256) }}
      className="max-h-56 overflow-y-auto z-[9999] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg animate-dropdown-in origin-top-left"
    >
      {results.map((user, index) => (
        <button
          type="button"
          key={user.id}
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(user);
          }}
          onMouseEnter={() => onHover(index)}
          className={`w-full flex items-center gap-2 px-3 py-2 text-left transition-colors duration-100 ${
            index === activeIndex ? "bg-brand-50 dark:bg-teal-900/30" : "hover:bg-gray-50 dark:hover:bg-white/5"
          }`}
        >
          {user.pictureUrl ? (
            <img src={user.pictureUrl} alt="" referrerPolicy="no-referrer" className="w-6 h-6 rounded-full object-cover shrink-0" />
          ) : (
            <div className="w-6 h-6 shrink-0 flex items-center justify-center rounded-full bg-gradient-to-br from-brand-650 to-brand-900 text-white text-[11px] font-semibold">
              {user.displayName.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
              {user.displayName}
              {user.fullRoleTag && <span className="ml-1.5 text-xs font-normal text-gray-400">({user.fullRoleTag})</span>}
            </div>
            {user.email && <div className="text-xs text-gray-400 truncate">{user.email}</div>}
          </div>
        </button>
      ))}
    </div>,
    document.body
  );
}

export default MentionDropdown;
