import React, { useState, useRef, useEffect } from 'react';
import { Question, useStore } from '../../../utils/store';
import { FaRegThumbsUp, FaRegCommentDots, FaFileAlt } from 'react-icons/fa';
import { BsThreeDotsVertical } from 'react-icons/bs';
import CommentBox from './CommentBox';
// NEW: Import the new CommentItem component
import CommentItem from './CommentItem';
import api from '../../../utils/api';
import Snackbar from '../../../components/ui/Snackbar';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import { Bookmark, Flag, Edit, Trash2 } from 'lucide-react';

interface Comment {
  id: number;
  content: string;
  created_at: string;
  user: { id: number; username: string }; // UPDATED: Added user.id
  likeCount?: number; // NEW: Added like count
}

interface ExplodedPostCardProps {
  question: Question;
  likes: number;
  setLikes: (newCount: number) => void;
  comments: number;
  setComments: (count: number) => void;
  handleClose: () => void;
  handleEdit: (updatedTitle: string, updatedDescription: string) => void;
  username: string;
  refreshInterests: () => void;
}

const ExplodedPostCard: React.FC<ExplodedPostCardProps> = ({
  question,
  likes,
  setLikes,
  setComments,
  handleClose,
  handleEdit,
  username,
  refreshInterests,
}) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(question.title);
  const [editedDescription, setEditedDescription] = useState(
    question.description
  );
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [elongated, setElongated] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // 🔥 NEW: Comment delete dialog state
  const [deletingComment, setDeletingComment] = useState<number | null>(null);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const deletePostFromStore = useStore((state) => state.deletePost);
  const updatePostInStore = useStore((state) => state.updatePost);
  const loggedInUserId = Number(localStorage.getItem('userId'));
  const isAuthor = loggedInUserId === question.user.id;

  const shouldTruncate = question.description.length > 150;
  const displayText = elongated
    ? question.description
    : question.description.substring(0, 150) + '...';

  const fetchComments = async (limit = 2, offset = 0) => {
    try {
      const res = await api.get(`/comments`, {
        params: {
          questionID: question.id,
          count: limit,
          offset: offset,
        },
      });

      const data = res.data;
      if (data.message === 'success') {
        // NEW: Initialize like counts for comments
        const commentsWithLikes = data.comments.map((comment: Comment) => ({
          ...comment,
          likeCount: comment.likeCount || 0,
        }));

        setCommentList(commentsWithLikes);
        setComments(data.total);
      }
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  };

  // NEW: Comment delete handler
  const handleCommentDelete = async (commentId: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await api.delete(`/comments`, {
        params: { commentID: commentId },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.status === 200) {
        setCommentList((prev) =>
          prev.filter((comment) => comment.id !== commentId)
        );
        setComments((prev) => prev - 1);
        setDeletingComment(null);
        showSnackbarMessage('Comment deleted successfully');
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
      showSnackbarMessage('Failed to delete comment');
    }
  };

  // NEW: Comment update handler
  const handleCommentUpdate = (commentId: number, newContent: string) => {
    setCommentList((prev) =>
      prev.map((comment) =>
        comment.id === commentId ? { ...comment, content: newContent } : comment
      )
    );
  };

  // NEW: Show snackbar helper
  const showSnackbarMessage = (message: string) => {
    setSnackbarMessage(message);
    setShowSnackbar(true);
    setTimeout(() => setShowSnackbar(false), 3000);
  };

  const handleDelete = async () => {
    try {
      const success = await deletePostFromStore(question.id);

      if (success) {
        await deleteInterestsByQuestionId(question.id);
        setSnackbarMessage('Post deleted successfully');
      } else {
        setSnackbarMessage('Failed to delete post');
      }

      setShowSnackbar(true);

      setTimeout(() => {
        setShowSnackbar(false);
        if (success) {
          handleClose();
          refreshInterests();
        }
      }, 4000);
    } catch (err: any) {
      console.error('Delete error:', err);
      setSnackbarMessage(err?.message || 'Error deleting post');
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 4000);
    } finally {
      setShowDeleteDialog(false);
    }
  };

  const deleteInterestsByQuestionId = async (questionId: number) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const getRes = await fetch(`${import.meta.env.VITE_API_URL}/interests`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await getRes.json();

      if (getRes.ok && data.message === 'success' && data.interests) {
        const interestsToDelete = data.interests.filter(
          (interest: any) => interest.question_id === questionId
        );

        for (const interest of interestsToDelete) {
          await fetch(
            `${import.meta.env.VITE_API_URL}/interests/${interest.id}`,
            {
              method: 'DELETE',
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }

        console.log(
          `Deleted ${interestsToDelete.length} interests for question ${questionId}`
        );
      }
    } catch (error) {
      console.error('Error deleting interests:', error);
    }
  };

  const handleUpdate = async () => {
    const success = await updatePostInStore(
      question.id,
      editedTitle,
      editedDescription
    );
    if (success) {
      handleEdit(editedTitle, editedDescription);
      setIsEditing(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [question.id]);

  const handleAddComment = () => {
    fetchComments(showAll ? 100 : 2);
  };

  const handleLike = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('You must be logged in to like a question.');

    try {
      const res = await api.post(
        `/questions/action`,
        {
          questionID: question.id,
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
        setLikes(likes + 1);
        setLiked(true);
      }
    } catch (err) {
      console.error('Error liking question:', err);
    }
  };

  const handleBookmark = async () => {
    const token = localStorage.getItem('token');
    if (!token) return alert('You must be logged in to bookmark a post.');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/interests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ question_id: question.id }),
      });

      const data = await res.json();
      if (res.ok && data.message === 'Interest created successfully') {
        setIsBookmarked(true);
        refreshInterests();
        handleClose();
      }
    } catch (err) {
      console.error('Error bookmarking post:', err);
    }
  };

  const handleClickOutside = (e: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(e.target as Node)
    ) {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDateTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div
      className="p-6 flex flex-col items-center space-y-4 relative overflow-y-auto max-h-[90vh]"
      style={{
        width: '676px',
        backgroundColor: '#FFFFFF',
        borderRadius: '7px',
        boxShadow: '0px 6px 18px 0px #442756',
      }}
    >
      {showSnackbar && (
        <Snackbar
          message={snackbarMessage}
          onClose={() => setShowSnackbar(false)}
        />
      )}

      {/* Dropdown */}
      <div className="absolute top-4 right-4">
        <button onClick={() => setShowDropdown(!showDropdown)}>
          <BsThreeDotsVertical size={20} />
        </button>
        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute right-0 mt-2 w-32 bg-white shadow-md rounded-md z-50"
          >
            <ul className="text-sm text-gray-700">
              <li
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => {
                  handleBookmark();
                  setShowDropdown(false);
                }}
              >
                <Bookmark
                  size={14}
                  className={`mr-2 ${
                    isBookmarked ? 'text-blue-500 fill-current' : ''
                  }`}
                />
                Bookmark
              </li>
              <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center">
                <Flag size={16} className="mr-2" />
                Report
              </li>
              {isAuthor && (
                <>
                  <li
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer space-x-2"
                    onClick={() => {
                      setIsEditing(true);
                      setShowDropdown(false);
                    }}
                  >
                    <Edit size={16} className="mr-2" />
                    Edit
                  </li>
                  <li
                    className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer space-x-2"
                    onClick={() => {
                      setShowDropdown(false);
                      setShowDeleteDialog(true);
                    }}
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </li>
                </>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this post?
            </h2>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowDeleteDialog(false)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW: Comment Delete Confirmation Dialog */}
      {deletingComment && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this comment?
            </h2>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeletingComment(null)}
                className="px-3 py-1 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={() => handleCommentDelete(deletingComment)}
                className="px-3 py-1 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Post Section */}
      <div className="w-full bg-[#F9F9F9] rounded p-4">
        {isAuthor && isEditing ? (
          <>
            <input
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="w-full border p-1 mb-2 rounded"
            />
            <textarea
              value={editedDescription}
              onChange={(e) => setEditedDescription(e.target.value)}
              className="w-full border p-1 mb-2 rounded"
            />
          </>
        ) : (
          <>
            <h3 className="text-lg font-semibold text-[#004466] mb-2">
              {username}
            </h3>
            <p className="text-xs text-gray-500 mb-4">
              {formatDateTime(question.created_at)}
            </p>
            <h3 className="text-lg font-semibold text-[#004466] mb-2">
              {question.title}
            </h3>
            <p className="text-sm text-[#616161] mb-2 inline">
              {displayText}
              {shouldTruncate && (
                <span
                  className="text-[#007880] cursor-pointer hover:opacity-80 transition ml-1 inline-flex items-center"
                  onClick={() => setElongated(!elongated)}
                >
                  {elongated ? 'Read less' : 'Read more'}{' '}
                  <span className="ml-1">
                    {elongated ? <IoIosArrowUp /> : <IoIosArrowDown />}
                  </span>
                </span>
              )}
            </p>
          </>
        )}

        <div className="mb-4">
          <p className="font-medium text-gray-700 mb-2 flex items-center">
            Attachments
          </p>
          <div className="flex items-center text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
            <FaFileAlt className="mr-2" /> Sample-attachment.pdf
          </div>
        </div>

        {isAuthor && isEditing && (
          <div className="flex justify-end space-x-2">
            <button
              className="px-3 py-1 bg-gray-200 rounded"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 bg-blue-500 text-white rounded"
              onClick={handleUpdate}
            >
              Save
            </button>
          </div>
        )}

        {/* Like + View Replies */}
        <div className="flex justify-between mt-4">
          <button
            onClick={() => {
              setShowAll(true);
              fetchComments(100);
            }}
            className="text-sm font-medium border px-3 py-1 rounded"
          >
            View All Replies
          </button>
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center text-sm cursor-pointer ${
                liked ? 'text-blue-600' : 'text-gray-600'
              }`}
              onClick={handleLike}
            >
              <FaRegThumbsUp className="mr-1" /> {likes} Likes
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <FaRegCommentDots className="mr-1" /> {commentList.length}{' '}
              Comments
            </div>
          </div>
        </div>
      </div>

      {/* UPDATED: Comment List using CommentItem component */}
      <div className="w-full space-y-2 px-2">
        {commentList
          .slice(0, showAll ? commentList.length : 2)
          .map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              loggedInUserId={loggedInUserId}
              onDelete={setDeletingComment}
              onUpdate={handleCommentUpdate}
              onShowSnackbar={showSnackbarMessage}
            />
          ))}
      </div>

      {/* Comment Box */}
      <CommentBox questionID={question.id} onCommentAdded={handleAddComment} />

      {/* Close Button */}
      <div className="absolute top-4 right-12">
        <button
          onClick={() => {
            refreshInterests();
            handleClose();
          }}
          className="text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default ExplodedPostCard;
