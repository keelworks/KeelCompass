import { useState, useEffect } from "react";
import { MdOutlineRateReview } from "react-icons/md";
import { FaRegThumbsUp, FaRegCommentDots, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { UserActionType, QuestionListItem } from "../../../utils/types";
import { createUserQuestionAction, deleteUserQuestionAction, createInterest, deleteInterest } from "../../../utils/store";
import { formatDate } from "../../../utils/format";
import QuestionDetails from "../cards/QuestionDetails";

interface QuestionItemProps {
  questionItem: QuestionListItem;
  selectedQuestionId: number | null;
  setSelectedQuestionId: (id: number | null) => void;
  onQuestionUpdated?: (updatedQuestion: Partial<QuestionListItem> & { id: number }) => void;
  onQuestionDeleted?: (deletedId: number) => void;
}

function QuestionItem({ questionItem, selectedQuestionId, setSelectedQuestionId, onQuestionUpdated, onQuestionDeleted }: QuestionItemProps) {
  const { id, user, title, description, status, createdAt, isInterested: interested, interestId: localInterestId, hasLiked: liked, likeCount: likes, commentCount, } = questionItem;
  const [isInterested, setIsInterested] = useState(interested);
  const [interestId, setInterestId] = useState<number | null>(localInterestId);
  const [hasLiked, setHasLiked] = useState(liked);
  const [likeCount, setLikeCount] = useState(likes);
  const [expanded, setExpanded] = useState(false);

  const handleCardClick = () => {
    setSelectedQuestionId(id);
  }

  const handleLikes = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setHasLiked((prev) => !prev);
    setLikeCount((prev) => prev + (hasLiked ? -1 : 1));
    try {
      if (!hasLiked) {
        await createUserQuestionAction({ questionId: id, actionType: UserActionType.Like });
      } else {
        await deleteUserQuestionAction({ questionId: id, actionType: UserActionType.Like });
      }
    } catch (error) {
      setHasLiked((prev) => !prev);
      setLikeCount((prev) => prev + (hasLiked ? 1 : -1));
      alert("Failed to update like status.");
    }
  };

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isInterested) {
      setIsInterested(true);
      try {
        const newInterestId = await createInterest(id);
        setInterestId(newInterestId);
      } catch (error) {
        setIsInterested(false);
        alert("Failed to bookmark question.");
      }
    } else {
      if (interestId == null) return;
      setIsInterested(false);
      try {
        await deleteInterest(interestId);
        setInterestId(null);
      } catch (error) {
        setIsInterested(true);
        alert("Failed to remove bookmark.");
      }
    }
  }

  function renderDescriptionContent(
    description: string,
    expanded: boolean,
    handleReadMoreClick: (e: React.MouseEvent) => void,
    handleReadLessClick: (e: React.MouseEvent) => void
  ) {
    const lines = (description || '').split('\n');
    const hasMore = lines.length > 1;

    return (
      <p className="text-base text-[#616161] leading-[1.5]">
        {expanded ? (
          <>
            {lines.map((line, idx) => <span key={idx} className="block">{line}</span>)}
            {hasMore && (
              <span className="text-[#007880] cursor-pointer hover:opacity-80 transition ml-1 inline-flex items-center" onClick={handleReadLessClick}>Read Less</span>
            )}
          </>
        ) : (
          <>
            {lines[0]}
            {hasMore && (
              <span className="text-[#007880] cursor-pointer hover:opacity-80 transition ml-1 inline-flex items-center" onClick={handleReadMoreClick}>Read More</span>
            )}
          </>
        )}
      </p>
    );
  }

  const handleReadLessClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Read less clicked for question', id);
  }

  const handleReadMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(true);
    console.log('Read more clicked for question', id);
  }

  const closeQuestionDetails = () => {
    setSelectedQuestionId(null);
  }

  useEffect(() => {
    setHasLiked(hasLiked);
    setLikeCount(likeCount);
    setInterestId(localInterestId);
  }, [hasLiked, likeCount, localInterestId]);


  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-2 cursor-pointer" onClick={handleCardClick}>
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">{user.username}</span>
          <span className="text-xs text-gray-400">• {formatDate(createdAt)}</span>
        </div>
        <div className="flex items-center gap-2">
          {status === 'pending' && (
            <span className="flex items-center">
              <MdOutlineRateReview className="mr-1 text-gray-500" />
              <span className="text-gray-500 text-xs">In Review</span>
            </span>
          )}
          <button className="p-1 rounded hover:bg-gray-100" onClick={handleBookmarkClick} title="Bookmark" type="button">
            {isInterested
              ? <FaBookmark className="text-blue-500" />
              : <FaRegBookmark className="text-gray-500" />}
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-[#004466] leading-relaxed mb-2">{title}</h3>

      {/* Description */}
      {renderDescriptionContent(description, expanded, handleReadMoreClick, handleReadLessClick)}

      {/* Footer */}
      <div className="flex justify-end mt-3 text-gray-600 text-sm">
        <div className={`flex items-center mr-4 cursor-pointer select-none text-sm ${hasLiked ? 'text-blue-600' : 'text-gray-600'}`} onClick={handleLikes}>
          <FaRegThumbsUp className="mr-1" />
          <span>{likeCount}</span>
        </div>
        <div className="flex items-center cursor-pointer" onClick={e => e.stopPropagation()}>
          <FaRegCommentDots className="mr-1" />
          <span>{commentCount}</span>
        </div>
      </div>

      {/* Question Details */}
      {selectedQuestionId === id && (
        <QuestionDetails
          questionId={id}
          onClose={closeQuestionDetails}
          onQuestionUpdated={onQuestionUpdated}
          onQuestionDeleted={onQuestionDeleted}
          onLikeUpdate={(questionId: number, hasLiked: boolean, likeCount: number) => {
            if (questionId === id) {
              setHasLiked(hasLiked);
              setLikeCount(likeCount);
            }
          }}
          onBookmarkUpdate={(questionId: number, isInterested: boolean, interestId: number | null) => {
            if (questionId === id) {
              setIsInterested(isInterested);
              setInterestId(interestId);
            }
          }}
        />
      )}
    </div>
  );
}

export default QuestionItem;
