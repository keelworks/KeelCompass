import { useState, useEffect, useRef } from 'react';
import { FaFileAlt, FaRegThumbsUp, FaRegCommentDots, FaThumbsUp } from 'react-icons/fa';
import { QuestionDetail, UserActionType } from '../../../utils/types';
import { getQuestion, createUserQuestionAction, deleteUserQuestionAction, createInterest, deleteInterest, updateQuestion, deleteQuestion } from '../../../utils/store';
import { formatDateTime } from '../../../utils/format';
import ThreeDotsMenu from '../../modules/ThreeDotsMenu';
import CommentItem from './CommentItem';
import CommentBox from './CommentInput';

interface QuestionDetailsProps {
  questionId: number;
  onClose: () => void;
  onLikeUpdate?: (questionId: number, hasLiked: boolean, likeCount: number) => void;
  onBookmarkUpdate?: (questionId: number, isInterested: boolean, interestId: number) => void;
  onQuestionUpdated?: (updatedQuestion: { id: number; title: string; description: string }) => void;
  onQuestionDeleted?: (deletedId: number) => void;
}

function QuestionDetails({ questionId, onClose, onLikeUpdate, onBookmarkUpdate, onQuestionUpdated, onQuestionDeleted }: QuestionDetailsProps) {
  const userId = Number(localStorage.getItem('userId'));
  const menuRef = useRef<HTMLDivElement>(null);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [question, setQuestion] = useState<QuestionDetail | null>(null);
  const [hasLiked, setHasLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isInterested, setIsInterested] = useState(false);
  const [interestId, setInterestId] = useState<number | null>(null);
  const [showAllReplies, setShowAllReplies] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({ title: '', description: '' });
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

  const fetchQuestion = async () => {
    try {
      const res = await getQuestion(questionId);
      setQuestion(res);
      setIsInterested(res.isInterested);
      setInterestId(res.interestId ?? null);
      setHasLiked(res.hasLiked);
      setLikeCount(res.likeCount);
      console.log('Fetched question:', res);
    } catch (err) {
      console.error(err);
      setQuestion(null);
      setIsInterested(false);
      setInterestId(null);
      setHasLiked(false);
      setLikeCount(0);
    }
  }

  const handleBookmarkQuestion = async () => {
    if (!question) return;
    if (!isInterested) {
      setIsInterested(true);
      try {
        const newInterest = await createInterest(question.id);
        setInterestId(newInterest);
        if (onBookmarkUpdate) onBookmarkUpdate(question.id, true, newInterest);
      } catch (error) {
        setIsInterested(false);
        if (onBookmarkUpdate) onBookmarkUpdate(question.id, false, 0);
        alert('Failed to bookmark question.');
      }
    } else {
      if (interestId == null) return;
      setIsInterested(false);
      try {
        await deleteInterest(interestId);
        setInterestId(null);
        if (onBookmarkUpdate) onBookmarkUpdate(question.id, false, 0);
      } catch (error) {
        setIsInterested(true);
        if (onBookmarkUpdate) onBookmarkUpdate(question.id, true, interestId);
        alert('Failed to remove bookmark.');
      }
    }
  }

  const handleReportQuestion = () => {
    console.log('Report clicked')
  }



  const handleEditQuestion = () => {
    if (editMode) {
      setEditMode(false);
    } else if (question) {
      setEditMode(true);
      setEditForm({ title: question.title, description: question.description });
    }
  }

  const handleSubmitEditQuestion = async () => {
    if (!question) return;
    try {
      const updatedQuestion = {
        id: question.id,
        title: editForm.title,
        description: editForm.description,
      };
      await updateQuestion(question.id, updatedQuestion);
      setEditMode(false);
      fetchQuestion();
      if (onQuestionUpdated) onQuestionUpdated(updatedQuestion);
    } catch (err) {
      alert('Failed to update question.');
    }
  }

  const handleDeleteQuestion = async () => {
    if (!question) return;
    try {
      await deleteQuestion(question.id);
      if (onQuestionDeleted) onQuestionDeleted(question.id);
      onClose();
    } catch (err) {
      alert('Failed to delete question.');
    }
  }

  useEffect(() => {
    fetchQuestion();
  }, [questionId]);

  const handleUserQuestionAction = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!question) return;
    const newLiked = !hasLiked;
    const newLikes = likeCount + (hasLiked ? -1 : 1);
    setHasLiked(newLiked);
    setLikeCount(newLikes);
    if (onLikeUpdate) {
      onLikeUpdate(question.id, newLiked, newLikes);
    }
    try {
      if (!hasLiked) {
        await createUserQuestionAction({ questionId: question.id, actionType: UserActionType.Like });
      } else {
        await deleteUserQuestionAction({ questionId: question.id, actionType: UserActionType.Like });
      }
    } catch (error) {
      setHasLiked(hasLiked);
      setLikeCount(likeCount);
      if (onLikeUpdate) {
        onLikeUpdate(question.id, hasLiked, likeCount);
      }
      alert('Failed to update like status.');
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-30 cursor-auto" style={{ zIndex: 49 }} onClick={e => { e.stopPropagation(); onClose(); }}></div>
      <div
        className="relative z-50 p-6 flex flex-col items-center space-y-4 overflow-y-auto max-h-[90vh] cursor-auto"
        style={{
          width: '676px',
          backgroundColor: '#FFFFFF',
          borderRadius: '7px',
          boxShadow: '0px 6px 18px 0px #442756',
        }}
        onClick={e => e.stopPropagation()}
      >
        {question && (
          <div className="absolute top-4 right-4">
            <ThreeDotsMenu
              userId={userId}
              menuRef={menuRef}
              menuId={`question-${question.id}`}
              openMenuId={openMenuId}
              setOpenMenuId={setOpenMenuId}
              handleBookmark={handleBookmarkQuestion}
              handleReport={handleReportQuestion}
              handleEdit={handleEditQuestion}
              handleDelete={() => setShowDeleteConfirmation(true)}
              question={question}
              isInterested={isInterested}
            />
          </div>
        )}

        {question && (
          <>
            <div className="w-full text-left bg-[#f6f6f6] rounded-lg p-6">
              <h3 className="text-lg font-semibold text-[#004466] mb-2">
                {question.user.username}
              </h3>
              <p className="text-xs text-gray-500 mb-4">
                {formatDateTime(question.createdAt)}
              </p>

              {editMode ? (
                <input
                  className="w-full mb-2 p-2 border rounded"
                  value={editForm.title}
                  onChange={e => setEditForm({ ...editForm, title: e.target.value })}
                  placeholder="Title"
                />
              ) : (
                <h3 className="text-lg font-semibold text-[#004466] mb-2">
                  {question.title}
                </h3>
              )}

              {editMode ? (
                <textarea
                  className="w-full mb-2 p-2 border rounded"
                  value={editForm.description}
                  onChange={e => setEditForm({ ...editForm, description: e.target.value })}
                  placeholder="Description"
                  rows={4}
                />
              ) : (
                <p className="text-sm text-[#616161] mb-2 inline">
                  {question.description}
                </p>
              )}

              {question.attachment && (
                <div className="mb-4 mt-3">
                  <div className="flex items-center text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    <FaFileAlt className="mr-2" /> {question.attachment.fileName}
                  </div>
                </div>
              )}

              {editMode && (
                <div className="flex justify-end gap-2 mt-2">
                  <button className="px-3 py-1 bg-gray-200 rounded" onClick={() => setEditMode(false)}>
                    Cancel
                  </button>
                  <button className="px-3 py-1 bg-blue-500 text-white rounded" onClick={handleSubmitEditQuestion}>
                    Save
                  </button>
                </div>
              )}

              <div className="flex items-center justify-between w-full mt-4">
                <div>
                  {question.comments && question.comments.length > 2 && !showAllReplies && (
                    <button
                      className="text-sm font-medium border px-3 py-1 rounded bg-white hover:bg-gray-50 transition"
                      onClick={() => setShowAllReplies(true)}
                    >
                      Show all replies
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <div className={`flex items-center text-sm cursor-pointer select-none ${hasLiked ? 'text-blue-600' : 'text-gray-600'}`} onClick={handleUserQuestionAction}>
                    {hasLiked ? <FaThumbsUp className="mr-1" /> : <FaRegThumbsUp className="mr-1" />}
                    {likeCount} Likes
                  </div>
                  <div className="flex items-center text-gray-600 text-sm">
                    <FaRegCommentDots className="mr-1" /> {question.commentCount} Comments
                  </div>
                </div>
              </div>
            </div>

            {question.comments && question.comments.length > 0 && (
              <div className="w-full mt-6">
                {(showAllReplies ? question.comments : question.comments.slice(0, 2)).map((comment) => (
                  <CommentItem
                    key={comment.id}
                    comment={comment}
                    openMenuId={openMenuId}
                    setOpenMenuId={setOpenMenuId}
                    onCommentDeleted={fetchQuestion}
                  />
                ))}
              </div>
            )}
          </>
        )}

        <div className="w-full flex justify-center mt-6">
          <CommentBox questionId={questionId} onCommentAdded={fetchQuestion} />
        </div>
      </div>

      {showDeleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this post?
            </h2>
            <div className="flex justify-end space-x-2">
              <button onClick={() => setShowDeleteConfirmation(false)} className="px-3 py-1 bg-gray-200 rounded">
                Cancel
              </button>
              <button onClick={handleDeleteQuestion} className="px-3 py-1 bg-red-500 text-white rounded">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default QuestionDetails;
