import React, { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { Flag, Edit, Trash2, Pin, PinOff, CheckCircle2, Circle, Bell, BellOff } from 'lucide-react';

// ThreeDotsMenu is used for both posts and comments, each passed in with
// their own full type elsewhere - only these fields are actually read here,
// so a minimal structural type covers both without needing `any` or an
// import coupling this to every shape that might ever pass through
interface MenuQuestion {
  pinned?: boolean;
  user: { id: number | null };
}
interface MenuComment {
  user: { id: number | null };
}

interface ThreeDotsMenuProps {
  menuRef: React.RefObject<HTMLDivElement>;
  menuId: string;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  handleInterest?: (e?: React.MouseEvent) => void;
  handleReport: () => void;
  handleEdit?: () => void;
  handleDelete?: () => void;
  handlePin?: () => void;
  handleAcceptAnswer?: () => void;
  isAccepted?: boolean;
  handleMuteToggle?: () => void;
  isMuted?: boolean;
  isAdmin?: boolean;
  userId: number;
  question?: MenuQuestion;
  comment?: MenuComment;
  isInterested?: boolean;
}

const ThreeDotsMenu = ({
  menuRef,
  menuId,
  openMenuId,
  setOpenMenuId,
  handleInterest,
  handleReport,
  handleEdit,
  handleDelete,
  handlePin,
  handleAcceptAnswer,
  isAccepted,
  handleMuteToggle,
  isMuted,
  isAdmin,
  userId,
  question,
  comment,
  isInterested,
}: ThreeDotsMenuProps) => {
  const toggleRef = useRef<HTMLButtonElement>(null);
  const [coords, setCoords] = useState<{ top: number; right: number } | null>(null);
  const isOpen = openMenuId === menuId;

  // portaled to document.body so the dropdown can spill out past a
  // scrollable popup/modal instead of being clipped at its edge, anchored
  // to the kebab button's live position (same fix as the @mention dropdown)
  useLayoutEffect(() => {
    if (!isOpen || !toggleRef.current) return;

    const updatePosition = () => {
      const rect = toggleRef.current?.getBoundingClientRect();
      if (!rect) return;
      setCoords({ top: rect.bottom + 4, right: window.innerWidth - rect.right });
    };

    updatePosition();
    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  return (
    <>
      <button
        ref={toggleRef}
        onClick={() => setOpenMenuId(isOpen ? null : menuId)}
        type="button"
        className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-150 rounded-full p-1 hover:bg-gray-100 dark:hover:bg-white/10"
        aria-label="More options"
      >
        <BsThreeDotsVertical size={18} />
      </button>

      {/* Menu Dropdown */}
      {isOpen && coords && createPortal(
        <div
          ref={menuRef}
          style={{ position: "fixed", top: coords.top, right: coords.right }}
          className="w-36 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg rounded-md z-[9999] origin-top-right animate-dropdown-in overflow-hidden"
        >
          <ul className="text-sm text-gray-700 dark:text-gray-200 py-1">
            {question && handleInterest && (
              <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer flex items-center transition-colors duration-100" onClick={(e) => { handleInterest?.(e); setOpenMenuId(null); }}>
                {isInterested ? (
                  <FaBookmark size={14} className="mr-2 text-blue-500" />
                ) : (
                  <FaRegBookmark size={14} className="mr-2 text-gray-500 dark:text-gray-400" />
                )}
                {isInterested ? 'Bookmarked' : 'Bookmark'}
              </li>
            )}
            {question && handleMuteToggle && (
              <li
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer flex items-center transition-colors duration-100"
                onClick={() => { handleMuteToggle(); setOpenMenuId(null); }}
              >
                {isMuted ? (
                  <BellOff size={14} className="mr-2 text-gray-500 dark:text-gray-400" />
                ) : (
                  <Bell size={14} className="mr-2 text-gray-500 dark:text-gray-400" />
                )}
                {isMuted ? 'Unmute thread' : 'Mute thread'}
              </li>
            )}
            <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer flex items-center transition-colors duration-100" onClick={() => { handleReport(); setOpenMenuId(null); }}>
              <Flag size={14} className="mr-2" />
              Report
            </li>
            {comment && handleAcceptAnswer && (
              <li
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer flex items-center text-green-700 dark:text-green-400 transition-colors duration-100"
                onClick={() => { handleAcceptAnswer(); setOpenMenuId(null); }}
              >
                {isAccepted ? <CheckCircle2 size={14} className="mr-2" /> : <Circle size={14} className="mr-2" />}
                {isAccepted ? 'Unaccept answer' : 'Accept as answer'}
              </li>
            )}
            {question && isAdmin && handlePin && (
              <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer flex items-center transition-colors duration-100" onClick={() => { handlePin(); setOpenMenuId(null); }}>
                {question.pinned ? (
                  <PinOff size={14} className="mr-2 text-gray-500 dark:text-gray-400" />
                ) : (
                  <Pin size={14} className="mr-2 text-gray-500 dark:text-gray-400" />
                )}
                {question.pinned ? 'Unpin' : 'Pin'}
              </li>
            )}
            {((question && userId === question.user.id) || (comment && userId === comment.user.id)) && handleEdit && (
              <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer flex items-center transition-colors duration-100" onClick={() => { handleEdit(); setOpenMenuId(null); }}>
                <Edit size={14} className="mr-2 text-gray-500 dark:text-gray-400" />
                Edit
              </li>
            )}
            {((question && userId === question.user.id) || (comment && userId === comment.user.id)) && handleDelete && (
              <li className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-white/10 cursor-pointer flex items-center text-red-500 dark:text-red-400 transition-colors duration-100" onClick={() => { handleDelete(); setOpenMenuId(null); }}>
                <Trash2 size={14} className="mr-2" />
                Delete
              </li>
            )}
          </ul>
        </div>,
        document.body
      )}
    </>
  );
};

export default ThreeDotsMenu;
