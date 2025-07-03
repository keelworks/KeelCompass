import { useEffect, useState } from "react";
import { Interest } from "../../../utils/types";
import { QuestionListItem, QuestionsResponse } from "../../../utils/types";
import QuestionItem from "./QuestionItem";
import QuestionDetails from "./QuestionDetails";

interface QuestionsSectionProps {
  questions: QuestionsResponse;
  setQuestions: (questions: QuestionsResponse) => void;
  onQuestionUpdate: (updatedQuestion: Partial<QuestionListItem> & { id: number }) => void;
  onQuestionDelete: (deletedId: number) => void;
  onQuestionLike: (questionId: number, hasLiked: boolean, likeCount: number) => void;
  interests: Interest[];
  setInterests: (interests: Interest[]) => void;
  onInterestUpdate: () => void;
  onCommentCreate: (questionId: number) => void;
  tab: 'recent' | 'popular';
  setTab: (tab: 'recent' | 'popular') => void;
  searchActive: boolean;
  setSearchActive: (active: boolean) => void;
  hasMore: boolean;
  pageSize: number;
}

function QuestionsSection({ questions, setQuestions, onQuestionUpdate, onQuestionDelete, onQuestionLike, interests, setInterests, onInterestUpdate, onCommentCreate, tab, setTab, searchActive, setSearchActive, hasMore, pageSize }: QuestionsSectionProps) {
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);
  const [visibleCount, setVisibleCount] = useState(pageSize);

  const handleTabChange = (newTab: 'recent' | 'popular') => {
    if (tab !== newTab) {
      setTab(newTab);
      setQuestions({ questions: [], offset: 0, count: pageSize });
      setVisibleCount(pageSize);
    } else if (searchActive) {
      setSearchActive(false);
      setQuestions({ questions: [], offset: 0, count: pageSize });
      setVisibleCount(pageSize);
    }
  };

  const handleViewMore = () => {
    if (visibleCount < questions.questions.length) {
      setVisibleCount(vc => vc + pageSize);
    } else if (hasMore) {
      setQuestions({
        ...questions,
        offset: questions.offset + pageSize,
      });
    }
  };

  // reset visible count when tab or questions change
  useEffect(() => {
    setVisibleCount(pageSize);
  }, [tab, questions.questions]);

  return (
    <div className="shadow-md rounded-lg p-4 mb-6" style={{ background: 'linear-gradient(to bottom, #f8f9fa 0%, #f8f9fa 100%)', width: '100%' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium uppercase tracking-wide">Posts</h2>
        {/* Tabs */}
        <div className="flex items-center bg-gray-200 rounded-md w-fit p-0.5 border border-gray-300">
          {[
            { label: "Most Recent", value: "recent" },
            { label: "Popular", value: "popular" }
          ].map((tabOption, index) => (
            <button
              key={tabOption.value}
              onClick={() => handleTabChange(tabOption.value as 'recent' | 'popular')}
              className={`px-4 py-2 text-sm font-normal border-r border-gray-300 ${tab === tabOption.value
                ? "bg-custom-gradient text-white"
                : "bg-white text-gray-600 hover:bg-gray-300"
                } ${index === 0 ? "rounded-l-md" : ""} ${index === 1 ? "rounded-r-md border-r-0" : ""}`}
            >
              {tabOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* Questions */}
      {questions.questions.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <div className="space-y-4">
          {questions.questions.slice(0, visibleCount).map(question => (
            <QuestionItem
              key={question.id}
              question={question}
              onQuestionLike={onQuestionLike}
              interests={interests}
              setInterests={setInterests}
              onInterestUpdate={onInterestUpdate}
              setSelectedQuestionId={setSelectedQuestionId}
            />
          ))}
        </div>
      )}

      {/* View More Button */}
      {(hasMore || visibleCount < questions.questions.length) && (
        <div className="mt-4 text-left">
          <button onClick={handleViewMore} className="bg-custom-gradient bg-clip-text cursor-pointer text-transparent transition hover:opacity-80">
            View more posts
            <span className="inline-block w-0 h-0 ml-1 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-teal-500"></span>
          </button>
        </div>
      )}

      {/* Question Details Modal */}
      {typeof selectedQuestionId === 'number' && !isNaN(selectedQuestionId) && (
        <QuestionDetails
          questionId={selectedQuestionId}
          onQuestionUpdate={onQuestionUpdate}
          onQuestionDelete={onQuestionDelete}
          onQuestionLike={onQuestionLike}
          interests={interests}
          setInterests={setInterests}
          onInterestsUpdate={onInterestUpdate}
          onCommentCreate={onCommentCreate}
          onClose={() => setSelectedQuestionId(null)}
        />
      )}
    </div>
  );
};

export default QuestionsSection;
