import { useEffect, useState } from "react";
import { QuestionListItem, QuestionsResponse } from "../../../utils/types";
import { getRecentQuestions, getPopularQuestions } from "../../../utils/store";
import QuestionItem from "./QuestionItem";
import QuestionDetails from "./QuestionDetails";

interface PostsSectionProps {
  questions: QuestionsResponse;
  setQuestions: (questions: QuestionsResponse) => void;
  tab: 'recent' | 'popular';
  setTab: (tab: 'recent' | 'popular') => void;
  searchActive: boolean;
  setSearchActive: (active: boolean) => void;
  onQuestionUpdated: (updatedQuestion: Partial<QuestionListItem> & { id: number }) => void;
  onQuestionDeleted: (deletedId: number) => void;
  hasMore: boolean;
  pageSize: number;
}

function PostsSection({ questions, tab, setTab, setQuestions, hasMore, onQuestionUpdated, onQuestionDeleted, pageSize, searchActive, setSearchActive }: PostsSectionProps) {
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

  // SYNC BOOKMARKS AND MAKE SURE LIKES ARE SYNCED TOO
  const handleBookmarkUpdate = async (questionId: number, isInterested: boolean, interestId: number | null) => {
    try {
      let updated: QuestionsResponse;
      if (tab === 'recent') {
        updated = await getRecentQuestions({ count: pageSize, offset: questions.offset });
      } else {
        updated = await getPopularQuestions({ count: pageSize, offset: questions.offset });
      }
      setQuestions(updated);
    } catch (err) {
      console.error('Failed to refresh questions after bookmark:', err);
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
          {questions.questions.slice(0, visibleCount).map(q => (
            <QuestionItem
              key={q.id}
              questionItem={q}
              selectedQuestionId={selectedQuestionId}
              setSelectedQuestionId={setSelectedQuestionId}
              onQuestionUpdated={onQuestionUpdated}
              onQuestionDeleted={onQuestionDeleted}
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
          onQuestionUpdated={onQuestionUpdated}
          onQuestionDeleted={onQuestionDeleted}
          onBookmarkUpdate={handleBookmarkUpdate}
          onClose={() => setSelectedQuestionId(null)}
        />
      )}
    </div>
  );
};

export default PostsSection;
