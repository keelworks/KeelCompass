import { useEffect, useRef, useState } from "react";
import { Interest } from "../../../utils/types";
import { QuestionListItem, QuestionsResponse } from "../../../utils/types";
import Snackbar from "../../../components/Snackbar";
import QuestionItem from "./QuestionItem";
import QuestionDetails from "./QuestionDetails";

interface QuestionsSectionProps {
  questions: QuestionsResponse;
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
  onSearchReset: () => void;
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  showSuccessSnackbar: boolean;
  onSuccessSnackbarClose: () => void;
}

function QuestionsSection({
  questions,
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
  onSearchReset,
  hasMore,
  isLoading,
  onLoadMore,
  showSuccessSnackbar,
  onSuccessSnackbarClose,
}: QuestionsSectionProps) {
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null
  );
  const listRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (newTab: "recent" | "popular") => {
    if (tab !== newTab) {
      if (searchActive) {
        onSearchReset();
      }
      setTab(newTab);
    } else if (searchActive) {
      onSearchReset();
    }
  };

  useEffect(() => {
    if (!hasMore || isLoading || questions.questions.length === 0) return;

    const listElement = listRef.current;
    const sentinelElement = sentinelRef.current;

    if (!listElement || !sentinelElement) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      {
        root: listElement,
        rootMargin: "0px 0px 200px 0px",
      }
    );

    observer.observe(sentinelElement);

    return () => observer.disconnect();
  }, [hasMore, isLoading, onLoadMore, questions.questions.length]);

  return (
    <div className="shadow-md rounded-lg p-4 mb-6 bg-gray-50 w-full h-full flex flex-col overflow-hidden">
      {/* Fixed Heading + Tabs */}
      <div className="mb-4 flex-shrink-0">
        <Snackbar
          message="Success - Your question posted!"
          isOpen={showSuccessSnackbar}
          onClose={onSuccessSnackbarClose}
          duration={4000}
          variant="inline"
        />
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
      <div ref={listRef} className="flex-1 overflow-y-auto pr-1 space-y-4">
        {isLoading && questions.questions.length === 0 ? (
          <p>Loading posts...</p>
        ) : questions.questions.length === 0 ? (
          <p>No posts found.</p>
        ) : (
          questions.questions.map((question) => (
            <div key={question.id}>
              <QuestionItem
                question={question}
                onQuestionLike={onQuestionLike}
                interests={interests}
                setInterests={setInterests}
                onInterestUpdate={onInterestUpdate}
                setSelectedQuestionId={setSelectedQuestionId}
              />
              <hr />
            </div>
          ))
        )}

        <div ref={sentinelRef} className="h-1" aria-hidden="true" />
        {isLoading && questions.questions.length > 0 && (
          <p className="py-4 text-center text-sm text-gray-500">
            Loading more posts...
          </p>
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
