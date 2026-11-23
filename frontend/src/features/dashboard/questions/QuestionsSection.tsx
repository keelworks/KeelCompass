import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiMessageSquare } from "react-icons/fi";
import { CommentSearchResult, Interest } from "../../../utils/types";
import { QuestionListItem, QuestionsResponse } from "../../../utils/types";
import { formatDateTime } from "../../../utils/format";
import Snackbar from "../../../components/Snackbar";
import QuestionItem from "./QuestionItem";
import QuestionDetails from "./QuestionDetails";
import SmoothExpand from "../../../components/ui/SmoothExpand";
import { QuestionCardSkeleton } from "../../../components/ui/Skeleton";
import EmptyState from "../../../components/ui/EmptyState";

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
  commentResults?: CommentSearchResult[];
  isAdmin?: boolean;
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
  commentResults = [],
  isAdmin = false,
  onSearchReset,
  hasMore,
  isLoading,
  onLoadMore,
  showSuccessSnackbar,
  onSuccessSnackbarClose,
}: QuestionsSectionProps) {
  const navigate = useNavigate();
  // accordion-style: at most one post is expanded in place at a time -
  // expanding a different one collapses whichever was open
  const [expandedQuestionId, setExpandedQuestionId] = useState<number | null>(null);
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
    <div className="shadow-md rounded-lg p-4 mb-6 bg-gray-50 dark:bg-gray-800 w-full h-full flex flex-col overflow-hidden">
      {/* Fixed Heading + Tabs */}
      <div className="mb-4 flex-shrink-0">
        <Snackbar
          message="Success - Your question posted!"
          isOpen={showSuccessSnackbar}
          onClose={onSuccessSnackbarClose}
          duration={4000}
          layout="inline"
        />
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-medium uppercase tracking-wide text-gray-900 dark:text-gray-100">Posts</h2>
          <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-md w-fit p-0.5 border border-gray-300 dark:border-gray-600">
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
                    ? "bg-white dark:bg-gray-900 text-brand-550 dark:text-teal-300 shadow-md"
                    : "bg-transparent text-[#5F6C7B] dark:text-gray-300 hover:bg-[#E5E7EB] dark:hover:bg-gray-600"
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
        {searchActive && commentResults.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
              Matching comments
            </p>
            {commentResults.map((c) => (
              <button
                key={`comment-${c.id}`}
                type="button"
                onClick={() => navigate(`/questions/${c.questionId}#comment-${c.id}`)}
                className="w-full text-left rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 transition-all duration-150 hover:shadow-sm hover:-translate-y-[1px] animate-card-in"
              >
                <div className="flex items-center justify-between gap-3 mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                    {c.user.displayName || c.user.username}
                  </span>
                  <span className="text-xs text-gray-400 shrink-0">{formatDateTime(c.createdAt)}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1 truncate">
                  commented on <span className="font-medium text-brand-800 dark:text-teal-300">{c.questionTitle}</span>
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">{c.content}</p>
              </button>
            ))}
            <hr className="border-gray-200 dark:border-gray-700" />
          </div>
        )}
        {isLoading && questions.questions.length === 0 ? (
          <>
            <QuestionCardSkeleton />
            <QuestionCardSkeleton />
            <QuestionCardSkeleton />
          </>
        ) : questions.questions.length === 0 ? (
          searchActive ? (
            <EmptyState
              icon={FiSearch}
              title="No results found"
              description="Try a different search term or filter."
            />
          ) : (
            <EmptyState
              icon={FiMessageSquare}
              title="No posts yet"
              description="Be the first to start a conversation."
            />
          )
        ) : (
          questions.questions.map((question, index) => {
            const isExpanded = expandedQuestionId === question.id;
            return (
              <div
                key={question.id}
                className={`rounded-xl border overflow-hidden transition-colors duration-300 ${
                  isExpanded
                    ? "border-teal-300 dark:border-teal-600 ring-1 ring-teal-100 dark:ring-teal-900/40 bg-teal-50/30 dark:bg-teal-950/10"
                    : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 hover:border-gray-300 dark:hover:border-gray-500"
                }`}
              >
                <SmoothExpand>
                  {isExpanded ? (
                    <QuestionDetails
                      questionId={question.id}
                      variant="page"
                      onCollapse={() => setExpandedQuestionId(null)}
                      onQuestionUpdate={onQuestionUpdate}
                      onQuestionDelete={(deletedId) => {
                        setExpandedQuestionId(null);
                        onQuestionDelete(deletedId);
                      }}
                      onQuestionLike={onQuestionLike}
                      interests={interests}
                      setInterests={setInterests}
                      onInterestsUpdate={onInterestUpdate}
                      onCommentCreate={onCommentCreate}
                      onCommentDelete={onCommentDelete}
                    />
                  ) : (
                    <QuestionItem
                      question={question}
                      onQuestionLike={onQuestionLike}
                      interests={interests}
                      setInterests={setInterests}
                      onInterestUpdate={onInterestUpdate}
                      setSelectedQuestionId={(id) => setExpandedQuestionId(id)}
                      index={index}
                      isAdmin={isAdmin}
                      onQuestionUpdate={onQuestionUpdate}
                    />
                  )}
                </SmoothExpand>
              </div>
            );
          })
        )}

        <div ref={sentinelRef} className="h-1" aria-hidden="true" />
        {isLoading && questions.questions.length > 0 && (
          <div className="pt-4">
            <QuestionCardSkeleton />
          </div>
        )}
      </div>
    </div>
  );
}

export default QuestionsSection;
