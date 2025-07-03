import { useState, useRef } from 'react';
import { FaRegThumbsUp, FaRegCommentDots } from 'react-icons/fa';
import { formatDateTime } from '../../../utils/format';
import { Comment, UserActionType } from '../../../utils/types';
import { createUserCommentAction, deleteUserCommentAction, updateComment, deleteComment } from '../../../utils/store';
import ThreeDotsMenu from '../../../components/ui/ThreeDotsMenu';

function CommentItem({ comment, onCommentDeleted, openMenuId, setOpenMenuId }: {
  comment: Comment,
  onCommentDeleted?: () => void
  openMenuId: string | null,
  setOpenMenuId: (id: string | null) => void,
}) {
  const userId = Number(localStorage.getItem('userId'));
  const menuRef = useRef<HTMLDivElement>(null);

  const [liked, setLiked] = useState(!!comment.hasLiked);
  const [likeCount, setLikeCount] = useState(typeof comment.likeCount === 'number' ? comment.likeCount : 0);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ content: comment.content });

  const handleLike = async () => {
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

  const handleEditComment = () => {
    if (editMode) {
      setEditMode(false);
    } else {
      setEditMode(true);
      setEditForm({ content: comment.content });
    }
    setOpenMenuId(null);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditForm({ content: comment.content });
  };

  const handleSubmitEdit = async () => {
    try {
      await updateComment({ id: comment.id, content: editForm.content });
      comment.content = editForm.content;
      setEditMode(false);
    } catch (err) {
      alert('Failed to update comment.');
    }
  };

  const handleDeleteComment = async () => {
    try {
      await deleteComment({ id: comment.id });
      setOpenMenuId(null);
      if (onCommentDeleted) onCommentDeleted();
    } catch (err) {
      alert('Failed to delete comment.');
      setOpenMenuId(null);
    }
  };

  const handleReportComment = () => {
    setOpenMenuId(null);
    alert('Reported!');
  };

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
          <div className="relative">
            <ThreeDotsMenu
              menuRef={menuRef}
              openMenuId={openMenuId}
              setOpenMenuId={setOpenMenuId}
              menuId={`comment-menu-${comment.id}`}
              userId={userId}
              handleReport={handleReportComment}
              handleEdit={handleEditComment}
              handleDelete={handleDeleteComment}
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
              <button className="px-3 py-1 bg-gray-200 rounded" onClick={handleCancelEdit}>Cancel</button>
              <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={handleSubmitEdit}>Save</button>
            </div>
          </div>
        ) : (
          <div className="mt-2 text-sm text-[#616161]">
            {comment.content}
          </div>
        )}

        {/* Likes */}
        <div className="flex items-center justify-end gap-6 mt-3">
          <div className={`flex items-center text-sm cursor-pointer select-none ${liked ? 'text-blue-600' : 'text-gray-600'}`} onClick={handleLike}>
            <FaRegThumbsUp className="mr-1" />
            {typeof likeCount === 'number' && !isNaN(likeCount) ? likeCount : 0} Like
          </div>
          <div className="flex items-center text-gray-600 text-sm">
            <FaRegCommentDots className="mr-1" />
            0 Replies
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
