import React from 'react';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { Flag, Edit, Trash2 } from 'lucide-react';

interface ThreeDotsMenuProps {
  menuRef: React.RefObject<HTMLDivElement>;
  menuId: string;
  openMenuId: string | null;
  setOpenMenuId: (id: string | null) => void;
  handleBookmark?: (e?: React.MouseEvent) => void;
  handleReport: () => void;
  handleEdit?: () => void;
  handleDelete?: () => void;
  userId: number;
  question?: any;
  comment?: any;
  isInterested?: boolean;
}

const ThreeDotsMenu = ({
  menuRef,
  menuId,
  openMenuId,
  setOpenMenuId,
  handleBookmark,
  handleReport,
  handleEdit,
  handleDelete,
  userId,
  question,
  comment,
  isInterested,
}: ThreeDotsMenuProps) => {
  return (
    <>
      <button onClick={() => setOpenMenuId(openMenuId === menuId ? null : menuId)} type="button">
        <BsThreeDotsVertical size={20} />
      </button>

      {/* Menu Dropdown */}
      {openMenuId === menuId && (
        <div ref={menuRef} className="absolute right-0 mt-2 w-32 bg-white shadow-md rounded-md z-50">
          <ul className="text-sm text-gray-700">
            {question && handleBookmark && (
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center" onClick={(e) => { handleBookmark?.(e); setOpenMenuId(null); }}>
                {isInterested ? (
                  <FaBookmark size={14} className="mr-2 text-blue-500" />
                ) : (
                  <FaRegBookmark size={14} className="mr-2 text-gray-500" />
                )}
                {isInterested ? 'Bookmarked' : 'Bookmark'}
              </li>
            )}
            <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center" onClick={() => { handleReport(); setOpenMenuId(null); }}>
              <Flag size={14} className="mr-2" />
              Report
            </li>
            {((question && userId === question.user.id) || (comment && userId === comment.user.id)) && handleEdit && (
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center" onClick={() => { handleEdit(); setOpenMenuId(null); }}>
                <Edit size={14} className="mr-2 text-gray-500" />
                Edit
              </li>
            )}
            {((question && userId === question.user.id) || (comment && userId === comment.user.id)) && handleDelete && (
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center" onClick={() => { handleDelete(); setOpenMenuId(null); }}>
                <Trash2 size={14} className="mr-2" />
                Delete
              </li>
            )}
          </ul>
        </div>
      )}
    </>
  );
};

export default ThreeDotsMenu;
