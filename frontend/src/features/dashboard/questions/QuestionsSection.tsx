import { useEffect, useState } from "react";
import { Interest } from "../../../utils/types";
import { QuestionListItem, QuestionsResponse } from "../../../utils/types";
import QuestionItem from "./QuestionItem";
import QuestionDetails from "./QuestionDetails";

interface QuestionsSectionProps {
  questions: QuestionsResponse;
  setQuestions: (questions: QuestionsResponse) => void;
  onQuestionUpdate: (
    updatedQuestion: Partial<QuestionListItem> & { id: number }
  ) => void;
  onQuestionDelete: (deletedId: number) => void;
  onQuestionLike: (
    questionId: number,
    hasLiked: boolean,
    likeCount: number
  ) => void;
  interests: Interest[];
  setInterests: (interests: Interest[]) => void;
  onInterestUpdate: () => void;
  onCommentCreate: (questionId: number) => void;
  onCommentDelete: (commentId: number) => void; // ✅ added
  tab: "recent" | "popular";
  setTab: (tab: "recent" | "popular") => void;
  searchActive: boolean;
  setSearchActive: (active: boolean) => void;
  hasMore: boolean;
  pageSize: number;
}

function QuestionsSection({
  questions,
  setQuestions,
  onQuestionUpdate,
  onQuestionDelete,
  onQuestionLike,
  interests,
  setInterests,
  onInterestUpdate,
  onCommentCreate,
  onCommentDelete,
  tab,
  setTab,
  searchActive,
  setSearchActive,
  hasMore,
  pageSize,
}: QuestionsSectionProps) {
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null
  );
  const [visibleCount, setVisibleCount] = useState(pageSize);

  const handleTabChange = (newTab: "recent" | "popular") => {
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
      setVisibleCount((vc) => vc + pageSize);
    } else if (hasMore) {
      setQuestions({
        ...questions,
        offset: questions.offset + pageSize,
      });
    }
  };

  // ✅ reset visible count when tab or question list changes
  useEffect(() => {
    setVisibleCount(pageSize);
  }, [tab, questions.questions, pageSize]);

  return (
    <div className="shadow-md rounded-lg p-4 mb-6 bg-gray-50 w-full h-full flex flex-col overflow-hidden">
      {/* Fixed Heading + Tabs */}
      <div className="mb-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-medium uppercase tracking-wide">Posts</h2>
          <div className="flex items-center bg-gray-100 rounded-md w-fit p-0.5 border border-gray-300">
            {[
              { label: "Most Recent", value: "recent" },
              { label: "Popular", value: "popular" },
            ].map((tabOption) => (
              <button
                key={tabOption.value}
                onClick={() =>
                  handleTabChange(tabOption.value as "recent" | "popular")
                }
                className={`px-6 py-[6px] text-[14px] font-medium leading-6 font-sans rounded-md transition duration-200 ${
                  tab === tabOption.value
                    ? "bg-white text-[#007575] shadow-md"
                    : "bg-transparent text-[#5F6C7B] hover:bg-[#E5E7EB]"
                }`}
              >
                {tabOption.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable Questions List */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4">
        {questions.questions.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          questions.questions.slice(0, visibleCount).map((question) => (
            <>
              <QuestionItem
                key={question.id}
                question={question}
                onQuestionLike={onQuestionLike}
                interests={interests}
                setInterests={setInterests}
                onInterestUpdate={onInterestUpdate}
                setSelectedQuestionId={setSelectedQuestionId}
              />
              <hr />
            </>
          ))
        )}

        {/* VIEW MORE */}
        {(hasMore || visibleCount < questions.questions.length) && (
          <div className="mt-4 w-full flex justify-center p-4 box-border">
            <button
              onClick={handleViewMore}
              className="flex items-center justify-center gap-2 min-w-[160px] px-6 py-3 text-teal-600 hover:text-teal-800 transition-colors text-sm font-medium whitespace-nowrap border border-transparent"
            >
              <span>View more posts</span>
              <span className="inline-block w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-teal-500"></span>
            </button>
          </div>
        )}
      </div>

      {/* Question Details Modal */}
      {typeof selectedQuestionId === "number" && !isNaN(selectedQuestionId) && (
        <QuestionDetails
          questionId={selectedQuestionId}
          onQuestionUpdate={onQuestionUpdate}
          onQuestionDelete={onQuestionDelete}
          onQuestionLike={onQuestionLike}
          interests={interests}
          setInterests={setInterests}
          onInterestsUpdate={onInterestUpdate}
          onCommentCreate={onCommentCreate}
          onCommentDelete={onCommentDelete}
          onClose={() => setSelectedQuestionId(null)}
        />
      )}
    </div>
  );
}

export default QuestionsSection;
