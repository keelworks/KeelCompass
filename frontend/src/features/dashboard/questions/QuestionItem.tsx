
import { FaRegThumbsUp, FaRegCommentDots, FaRegBookmark, FaBookmark } from "react-icons/fa";
import { MdOutlineRateReview } from "react-icons/md";
import { formatDate } from "../../../utils/format";
import { UserActionType, QuestionListItem, Interest } from "../../../utils/types";
import { createUserQuestionAction, deleteUserQuestionAction, createInterest, deleteInterest } from "../../../utils/store";

interface QuestionItemProps {
  question: QuestionListItem;
  onQuestionLike: (questionId: number, hasLiked: boolean, likeCount: number) => void;
  interests: Interest[];
  setInterests: (interests: Interest[]) => void;
  onInterestUpdate: () => void;
  setSelectedQuestionId: (id: number | null) => void;
}

function QuestionItem({ question, onQuestionLike, interests, setInterests, onInterestUpdate, setSelectedQuestionId }: QuestionItemProps) {
  const { id, user, title, description, status, createdAt, hasLiked, likeCount, commentCount } = question;

  const isInterested = question.isInterested;
  const interestId = question.interestId;

  const renderDescription = () => {
    const text = description || '';
    const maxLen = 100;
    if (text.length > maxLen) {
      return text.slice(0, maxLen) + '...';
    }
    return text;
  }

  const handleLikeQuestion = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const newLiked = !hasLiked;
    const newLikes = likeCount + (hasLiked ? -1 : 1);
    onQuestionLike(id, newLiked, newLikes);
    try {
      if (!hasLiked) {
        await createUserQuestionAction({ questionId: id, actionType: UserActionType.Like });
      } else {
        await deleteUserQuestionAction({ questionId: id, actionType: UserActionType.Like });
      }
    } catch (error) {
      alert("Failed to update like status.");
    }
  };

  const handleInterestQuestion = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isInterested) {
      try {
        const newInterest: Interest = await createInterest({ questionId: id });
        setInterests([...interests, newInterest]);
      } catch (error) {
        alert("Failed to bookmark question.");
      }
    } else {
      if (interestId == null) return;
      try {
        await deleteInterest({ id: interestId });
        setInterests(interests.filter(i => i.id !== interestId));
      } catch (error) {
        alert("Failed to remove bookmark.");
      }
    }
    onInterestUpdate();
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col gap-2 cursor-pointer" onClick={() => setSelectedQuestionId(id)}>
      <div className="flex items-center justify-between mb-2">
        {/* Username and Date */}
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-900">{user.username}</span>
          <span className="text-xs text-gray-400">• {formatDate(createdAt)}</span>
        </div>
        {/* Bookmark and Status */}
        <div className="flex items-center gap-2">
          {status === 'pending' && (
            <span className="flex items-center">
              <MdOutlineRateReview className="mr-1 text-gray-500" />
              <span className="text-gray-500 text-xs">In Review</span>
            </span>
          )}
          <button className="p-1 rounded hover:bg-gray-100" onClick={handleInterestQuestion} title="Bookmark" type="button">
            {isInterested
              ? <FaBookmark className="text-blue-500" />
              : <FaRegBookmark className="text-gray-500" />}
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-[#004466] leading-relaxed mb-2">{title}</h3>

      {/* Description */}
      <p className="text-base text-[#616161] leading-[1.5]">
        {renderDescription()}
      </p>

      <div className="flex justify-end mt-3 text-gray-600 text-sm">
        {/* Likes */}
        <div className={`flex items-center mr-4 cursor-pointer select-none text-sm ${hasLiked ? 'text-blue-600' : 'text-gray-600'}`} onClick={handleLikeQuestion}>
          <FaRegThumbsUp className="mr-1" />
          <span>{likeCount}</span>
        </div>
        {/* Comments */}
        <div className="flex items-center cursor-pointer" onClick={e => e.stopPropagation()}>
          <FaRegCommentDots className="mr-1" />
          <span>{commentCount}</span>
        </div>
      </div>
    </div>
  );
}

export default QuestionItem;
