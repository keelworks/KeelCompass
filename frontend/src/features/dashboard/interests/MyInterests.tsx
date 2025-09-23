import { useState } from 'react';
import { Bookmark } from 'lucide-react';
import QuestionDetails from '../questions/QuestionDetails';
import { Interest, QuestionListItem } from '../../../utils/types';
import InterestItem from './InterestItem';

interface MyInterstProps {
  interests: Interest[];
  questions: QuestionListItem[];
  onQuestionUpdate?: (
    updatedQuestion: Partial<QuestionListItem> & { id: number }
  ) => void;
  onQuestionDelete?: (deletedId: number) => void;
  onQuestionLike?: (
    questionId: number,
    hasLiked: boolean,
    likeCount: number
  ) => void;
  setInterests?: (interests: Interest[]) => void;
  onInterestUpdate?: () => void;
  onCommentCreate?: (questionId: number) => void;
  onCommentDelete?: (commentId: number) => void;
}

const MyInterests = ({
  interests,
  questions,
  onQuestionUpdate,
  onQuestionDelete,
  onQuestionLike,
  setInterests,
  onInterestUpdate,
  onCommentCreate,
  onCommentDelete,
}: MyInterstProps) => {
  const [showAll, setShowAll] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null
  );
  
  const formatLongDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  
  const getCommentCount = (questionId: number): number => {
    const question = questions.find((q) => q.id === questionId);
    return question?.commentCount || 0;
  };

  const handleQuestionUpdateLocal = (
    updatedQuestion: Partial<QuestionListItem> & { id: number }
  ) => {
    if (onQuestionUpdate) {
      onQuestionUpdate(updatedQuestion);
    }
  };

  const handleQuestionDeleteLocal = (deletedId: number) => {
    if (onQuestionDelete) {
      onQuestionDelete(deletedId);
    }
    setSelectedQuestionId(null);
  };

  const handleQuestionLikeLocal = (
    questionId: number,
    hasLiked: boolean,
    likeCount: number
  ) => {
    if (onQuestionLike) {
      onQuestionLike(questionId, hasLiked, likeCount);
    }
  };

  const handleCommentCreateLocal = (questionId: number) => {
    if (onCommentCreate) {
      onCommentCreate(questionId);
    }
  };

  const handleCommentDeleteLocal = (questionId: number) => {
    if (onCommentDelete) {
      onCommentDelete(questionId);
    }
  };

  const handleInterestUpdateLocal = () => {
    if (onInterestUpdate) {
      onInterestUpdate();
    }
  };


  const handleInterestItemClick = (questionId: number) => {
    setSelectedQuestionId(questionId);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col h-full p-6 bg-white shadow-md rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium text-[#4A4A4A] uppercase tracking-wide">
            My Interests
          </h2>
          <div className="w-5 h-5 bg-[#007575] rounded-sm flex items-center justify-center">
            <Bookmark size={12} className="text-white fill-white" />
          </div>
        </div>

        <div
          className={`flex flex-col space-y-4 transition-all duration-300 ${
            showAll && interests.length > 3 ? 'flex-1 overflow-y-auto pr-2' : ''
          }`}
          style={{
            maxHeight:
              showAll && interests.length > 3 ? 'calc(100vh - 300px)' : 'none',
          }}
        >
          {interests.length > 0 ? (
            (showAll ? interests : interests.slice(0, 3)).map((interest) => {
              // 🔥 CHANGED: Always use live question data (no fallback to cached data)
              const liveQuestion = questions.find(q => q.id === interest.question_id);
              
              return (
                <InterestItem
                  key={interest.id}
                 
                  title={liveQuestion?.title || ''}
                  date={formatLongDate(interest.created_at)}

                  commentCount={liveQuestion?.commentCount || 0}
                  onClick={() =>
                    handleInterestItemClick(interest.question_id || 0)
                  }
                />
              );
            })
          ) : (
            <div className="flex justify-center items-center flex-grow">
              <p className="text-gray-500">No interests found</p>
            </div>
          )}
        </div>

        {interests.length > 3 && (
          <div className="mt-6">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-[#007575] hover:text-[#005555] font-medium flex items-center gap-1 transition-colors duration-200"
            >
              <span>{showAll ? 'Show Less' : 'View all My Interests'}</span>
              <span className="text-[#007575]">→</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Modal */}
      {typeof selectedQuestionId === 'number' &&
        !isNaN(selectedQuestionId) &&
        selectedQuestionId > 0 && (
          <QuestionDetails
            questionId={selectedQuestionId}
            onQuestionUpdate={handleQuestionUpdateLocal}
            onQuestionDelete={handleQuestionDeleteLocal}
            onQuestionLike={handleQuestionLikeLocal}
            interests={interests}
            setInterests={setInterests || (() => {})} 
            onInterestsUpdate={handleInterestUpdateLocal}
            onCommentCreate={handleCommentCreateLocal}
            onCommentDelete={handleCommentDeleteLocal}
            onClose={() => setSelectedQuestionId(null)}
          />
        )}
    </div>
  );
};

export default MyInterests;