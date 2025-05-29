import React, { useState, useRef, useEffect } from 'react';
import { FaRegThumbsUp, FaRegCommentDots } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { Flag, Edit, Trash2 } from 'lucide-react';
import api from '../../../utils/api';

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user: { id: number; username: string };
  likeCount?: number;
}

interface CommentItemProps {
  comment: Comment;
  loggedInUserId: number;
  onDelete: (commentId: number) => void;
  onUpdate: (commentId: number, newContent: string) => void;
  onShowSnackbar: (message: string) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  loggedInUserId,
  onDelete,
  onUpdate,
  onShowSnackbar,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const isAuthor = comment.user.id === loggedInUserId;

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleLike = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('You must be logged in to like a comment.');

    try {
      const res = await api.post(
        `/comments/action`,
        {
          commentID: comment.id,
          actionType: 'like',
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data;
      if (data.message === 'success') {
        setLikeCount(prev => prev + 1);
        setLiked(true);
      }
    } catch (err) {
      console.error('Error liking comment:', err);
      onShowSnackbar('Failed to like comment');
    }
  };

  const handleEdit = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await api.put(
        `/comments`,
        {
          commentID: comment.id,
          content: editedContent,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = res.data;
      if (data.message === 'success') {
        onUpdate(comment.id, editedContent);
        setIsEditing(false);
        onShowSnackbar('Comment updated successfully');
      }
    } catch (err) {
      console.error('Error updating comment:', err);
      onShowSnackbar('Failed to update comment');
    }
  };

  const startEditing = () => {
    setIsEditing(true);
    setEditedContent(comment.content);
    setShowDropdown(false);
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditedContent(comment.content);
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="bg-gray-100 rounded p-3 text-sm relative">
      {/* Comment Header */}
      <div className="flex justify-between items-start mb-2">
        <div>
          <strong>{comment.user.username}</strong>
          <p className="text-xs text-gray-500">
            {formatDateTime(comment.created_at)}
          </p>
        </div>
        
        {/* Three Dots Dropdown */}
        <div className="relative">
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            className="text-gray-400 hover:text-gray-600"
          >
            <BsThreeDotsVertical size={14} />
          </button>
          
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute right-0 mt-1 w-24 bg-white shadow-md rounded-md z-40 text-xs"
            >
              <ul className="text-gray-700">
                <li className="px-3 py-1 hover:bg-gray-100 cursor-pointer flex items-center">
                  <Flag size={12} className="mr-1" />
                  Report
                </li>
                {isAuthor && (
                  <>
                    <li
                      className="px-3 py-1 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={startEditing}
                    >
                      <Edit size={12} className="mr-1" />
                      Edit
                    </li>
                    <li
                      className="px-3 py-1 hover:bg-gray-100 cursor-pointer flex items-center"
                      onClick={() => {
                        onDelete(comment.id);
                        setShowDropdown(false);
                      }}
                    >
                      <Trash2 size={12} className="mr-1" />
                      Delete
                    </li>
                  </>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Comment Content */}
      {isEditing ? (
        <div className="mb-2">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full border p-2 rounded text-sm"
            rows={2}
          />
          <div className="flex justify-end space-x-2 mt-2">
            <button
              className="px-2 py-1 bg-gray-200 rounded text-xs"
              onClick={cancelEditing}
            >
              Cancel
            </button>
            <button
              className="px-2 py-1 bg-blue-500 text-white rounded text-xs"
              onClick={handleEdit}
            >
              Save
            </button>
          </div>
        </div>
      ) : (
        <p className="mb-2">{comment.content}</p>
      )}

      {/* Like Button and Reply Icon */}
      <div className="flex justify-end space-x-4">
        <div
          className={`flex items-center text-xs cursor-pointer ${
            liked ? 'text-blue-600' : 'text-gray-600'
          }`}
          onClick={handleLike}
        >
          <FaRegThumbsUp className="mr-1" size={12} /> 
          {likeCount} Likes
        </div>
        {/* 🔥 NEW: Comment/Reply icon (placeholder for nested replies) */}
        <div className="flex items-center text-gray-600 text-xs">
          <FaRegCommentDots className="mr-1" size={12} /> 
          0 Replies
        </div>
      </div>
    </div>
  );
};

export default CommentItem;