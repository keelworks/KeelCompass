import { useState, useRef, useEffect } from 'react';
import { FaRegThumbsUp, FaRegCommentDots } from 'react-icons/fa';
import { formatDateTime } from '../../../utils/format';
import { Comment, UserActionType } from '../../../utils/types';
import { createUserCommentAction, deleteUserCommentAction, updateComment, deleteComment } from '../../../utils/store';
import ThreeDotsMenu from '../../../components/ui/ThreeDotsMenu';

interface CommentItemProps {
  comment: Comment,
  onCommentDelete?: () => void
  openMenuId: string | null,
  setOpenMenuId: (id: string | null) => void,
}

function CommentItem({ comment, onCommentDelete, openMenuId, setOpenMenuId }: CommentItemProps) {
  const userId = Number(localStorage.getItem('userId'));
  const menuRef = useRef<HTMLDivElement>(null);

  const [liked, setLiked] = useState(!!comment.hasLiked);
  const [likeCount, setLikeCount] = useState(typeof comment.likeCount === 'number' ? comment.likeCount : 0);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ content: comment.content });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const handleCommentEdit = () => {
    if (editMode) {
      setEditMode(false);
    } else {
      setEditMode(true);
      setEditForm({ content: comment.content });
    }
    setOpenMenuId(null);
  };

  const handleCancelCommentEdit = () => {
    setEditMode(false);
    setEditForm({ content: comment.content });
  };

  const handleSubmitCommentEdit = async () => {
    try {
      await updateComment({ id: comment.id, content: editForm.content });
      comment.content = editForm.content;
      setEditMode(false);
    } catch (err) {
      alert('Failed to update comment.');
    }
  };

  const handleCommentDelete = async () => {
    if (!comment) return;
    try {
      await deleteComment({ id: comment.id });
      if (onCommentDelete) onCommentDelete();
      setOpenMenuId(null);
    } catch (err) {
      alert('Failed to delete comment.');
      setOpenMenuId(null);
    }
  };

  const handleCommentLike = async () => {
    const prevLiked = liked;
    setLiked(!prevLiked);
    setLikeCount(prev => prev + (prevLiked ? -1 : 1));
    try {
      if (!prevLiked) {
        await createUserCommentAction({ commentId: comment.id, actionType: UserActionType.Like });
      } else {
        await deleteUserCommentAction({ commentId: comment.id, actionType: UserActionType.Like });
      }
    } catch (err) {
      setLiked(prevLiked);
      setLikeCount(prev => prev + (prevLiked ? 1 : -1));
      alert('Failed to update like status.');
    }
  };

  const handleReportComment = () => {
    setOpenMenuId(null);
    alert('Reported!');
  };

  // close ThreeDotsMenu when clicking outside menu but inside QuestionDetails
  useEffect(() => {
    if (!openMenuId || openMenuId !== `comment-menu-${comment.id}`) return;
    function handleDocClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    }
    document.addEventListener('mousedown', handleDocClick);
    return () => {
      document.removeEventListener('mousedown', handleDocClick);
    };
  }, [openMenuId, setOpenMenuId, comment.id]);

  return (
    <div className="w-full bg-gray-100 rounded-lg px-4 py-3 mb-3 shadow-sm">
      <div>
        <div className="flex items-start justify-between">
          {/* Username and Date */}
          <div>
            <span className="font-semibold text-[#004466]">{comment.user.username}</span>
            <div className="text-xs text-gray-500 mt-1">{formatDateTime(comment.createdAt)}</div>
          </div>

          {/* Menu */}
          <div className="relative" ref={menuRef}>
            <ThreeDotsMenu
              menuRef={menuRef}
              menuId={`comment-menu-${comment.id}`}
              openMenuId={openMenuId}
              setOpenMenuId={setOpenMenuId}
              handleReport={handleReportComment}
              handleEdit={handleCommentEdit}
              handleDelete={() => setShowDeleteConfirmation(true)}
              userId={userId}
              comment={comment}
            />
          </div>
        </div>

        {/* Content */}
        {editMode ? (
          <div className="mt-2">
            <textarea
              className="w-full p-2 border rounded mb-2"
              value={editForm.content}
              onChange={e => setEditForm({ content: e.target.value })}
              rows={2}
            />
            <div className="flex gap-2 justify-end">
              <button className="px-3 py-1 bg-gray-200 rounded" onClick={handleCancelCommentEdit}>Cancel</button>
              <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={handleSubmitCommentEdit}>Save</button>
            </div>
          </div>
        ) : (
          <div className="mt-2 text-sm text-[#616161]">
            {comment.content}
          </div>
        )}

        {/* Likes */}
        <div className="flex items-center justify-end gap-6 mt-3">
          <div className={`flex items-center text-sm cursor-pointer select-none ${liked ? 'text-blue-600' : 'text-gray-600'}`} onClick={handleCommentLike}>
            <FaRegThumbsUp className="mr-1" />
            {typeof likeCount === 'number' && !isNaN(likeCount) ? likeCount : 0} Like
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <FaRegCommentDots className="mr-1" />
            0 Replies
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50" >
          <div className="bg-white p-6 rounded shadow-md max-w-sm w-full" >
            <h2 className="text-lg font-semibold mb-4" >
              Are you sure you want to delete this comment?
            </h2>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowDeleteConfirmation(false)} className="px-3 py-1 bg-gray-200 rounded" >
                Cancel
              </button>
              <button onClick={handleCommentDelete} className="px-3 py-1 bg-red-500 text-white rounded" >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentItem;
