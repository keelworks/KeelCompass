import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Interest, QuestionsResponse } from "../utils/types";
import {
  getAllCategories,
  getPopularQuestions,
  getRecentQuestions,
  getUserInterests,
} from "../utils/store";
import MainLayout from "../components/wrappers/MainLayout";
import SearchBar from "../features/dashboard/searchBar/SearchBar";
import QuestionsSection from "../features/dashboard/questions/QuestionsSection";
import MyInterests from "../features/dashboard/interests/MyInterests";
import QuestionCreate from "../pages/QuestionCreate"; // adjust the path to where your file is

const PAGE_SIZE = 3;

const Dashboard = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<QuestionsResponse>({
    questions: [],
    count: PAGE_SIZE,
    offset: 0,
  });
  const [interests, setInterests] = useState<Interest[]>([]);
  const [tab, setTab] = useState<"recent" | "popular">("recent");
  const [searchActive, setSearchActive] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showAsk, setShowAsk] = useState(false);
  const [askDisabled, setAskDisabled] = useState(false);
  const [questionTitle, setQuestionTitle] = useState("");
  const [showDiscardModal, setShowDiscardModal] = useState(false);

  const handleHomeClickFromSidebar = () => {
    // If no title entered, go directly to dashboard
    if (!questionTitle.trim()) {
      setShowAsk(false);
      setQuestionTitle("");
      return;
    }
    // If title exists, show confirmation modal
    setShowDiscardModal(true);
  };

  const handleQuestionUpdate = (
    updatedQuestion: Partial<QuestionsResponse> & { id: number }
  ) => {
    setQuestions((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === updatedQuestion.id ? { ...q, ...updatedQuestion } : q
      ),
    }));
  };

  const handleQuestionDelete = (deletedId: number) => {
    setQuestions((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== deletedId),
    }));
  };

  const handleQuestionLike = (
    questionId: number,
    hasLiked: boolean,
    likeCount: number
  ) => {
    setQuestions((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, hasLiked, likeCount } : q
      ),
    }));
  };

  const handleInterestUpdate = async () => {
    setInterests(await getUserInterests());
  };

  const handleCommentCreate = (questionId: number) => {
    setQuestions((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? { ...q, commentCount: (q.commentCount ?? 0) + 1 }
          : q
      ),
    }));
  };

  const handleCommentDelete = (questionId: number) => {
    setQuestions((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? { ...q, commentCount: Math.max((q.commentCount ?? 0) - 1, 0) }
          : q
      ),
    }));
  };

  // fetch categories and interest
  useEffect(() => {
    const fetchCategories = async () => {
      const cached = localStorage.getItem("categories");
      if (!cached) {
        try {
          const categories = await getAllCategories();
          localStorage.setItem("categories", JSON.stringify(categories));
        } catch (err) {
          console.error("Failed to fetch categories", err);
        }
      }
    };
    fetchCategories();
    handleInterestUpdate();
  }, []);

  // exit search mode and fetch questions when tabs change
  useEffect(() => {
    setSearchActive(false);
    setQuestions({ questions: [], count: PAGE_SIZE, offset: 0 });
  }, [tab]);

  useEffect(() => {
    if (!showAsk) setAskDisabled(false);
  }, [showAsk]);

  // fetch questions when tab, question.offset, or search mode changes
  useEffect(() => {
    if (searchActive) return;
    const fetchQuestions = async () => {
      const offset = questions.offset || 0;
      let data;
      if (tab === "popular") {
        data = await getPopularQuestions({ count: PAGE_SIZE, offset });
      } else {
        data = await getRecentQuestions({ count: PAGE_SIZE, offset });
      }
      setQuestions((prev) => ({
        ...data,
        questions:
          offset === 0
            ? data.questions
            : [...prev.questions, ...data.questions],
        offset: data.offset === -1 ? prev.offset : data.offset,
      }));
      setHasMore(data.offset !== -1);
    };
    fetchQuestions();
  }, [tab, questions.offset, searchActive]);

  return (
    <MainLayout
      searchBar={
        <SearchBar
          pageSize={PAGE_SIZE}
          setQuestions={setQuestions}
          setSearchActive={setSearchActive}
        />
      }
      showAsk={showAsk}
      questionTitle={questionTitle}
      onHomeClick={handleHomeClickFromSidebar}
    >
      {/* Middle Column - Questions */}
      <div className="col-span-2 flex flex-col h-full overflow-hidden">
        {/* QuestionsSection scrolls internally */}
        <div className="flex-1 overflow-hidden">
          {showAsk ? (
            <QuestionCreate
              navigate={(path: string) => {
                if (path === "/dashboard") {
                  setShowAsk(false);
                  setQuestionTitle("");
                  setTab("recent");
                  setQuestions({ questions: [], count: PAGE_SIZE, offset: 0 });
                }
              }}
              onTitleChange={setQuestionTitle}
              showDiscardModal={showDiscardModal}
              setShowDiscardModal={setShowDiscardModal}
            />
          ) : (
            <QuestionsSection
              questions={{
                ...questions,
                questions: questions.questions.map((q) => {
                  const found = interests.find((i) => i.question_id === q.id);
                  return {
                    ...q,
                    isInterested: !!found,
                    interestId: found ? found.id : null,
                  };
                }),
              }}
              setQuestions={setQuestions}
              onQuestionUpdate={handleQuestionUpdate}
              onQuestionDelete={handleQuestionDelete}
              onQuestionLike={handleQuestionLike}
              interests={interests}
              setInterests={setInterests}
              onInterestUpdate={handleInterestUpdate}
              onCommentCreate={handleCommentCreate}
              onCommentDelete={handleCommentDelete}
              tab={tab}
              setTab={setTab}
              searchActive={searchActive}
              setSearchActive={setSearchActive}
              hasMore={hasMore}
              pageSize={PAGE_SIZE}
            />
          )}
        </div>
      </div>

      {/* Right Column - My Interests */}
      <div className="col-span-1 flex flex-col">
        <div className="mb-8">
          <button
            disabled={askDisabled}
            className="w-full h-[48px] flex items-center justify-center gap-[8px]
    rounded-[9px] text-white font-medium text-[16px]
    transition-all duration-150 focus:outline-none
    disabled:cursor-not-allowed"
            style={{
              background: askDisabled ? "#007C8833" : "#007C88",
              border: askDisabled ? "2px solid transparent" : "none",
              borderRadius: askDisabled ? "8px" : "9px",
              boxShadow: askDisabled ? "none" : "0px 6px 10px 0px #0000001A",
              padding: "16px",
              minWidth: "306px",
            }}
            onMouseEnter={(e) => {
              if (e.currentTarget.disabled) return;
              e.currentTarget.style.background = "#066A71";
              e.currentTarget.style.border = "2px solid #007C88";
              e.currentTarget.style.boxShadow = "2px 3px 4px 0px #0000001A";
            }}
            onMouseLeave={(e) => {
              if (e.currentTarget.disabled) return;
              e.currentTarget.style.background = "#007C88";
              e.currentTarget.style.border = "none";
              e.currentTarget.style.boxShadow = "0px 6px 10px 0px #0000001A";
            }}
            onMouseDown={(e) => {
              e.currentTarget.focus();
              if (e.currentTarget.disabled) return;
              e.currentTarget.style.background = "#409EA5";
              e.currentTarget.style.border = "2px solid #007C88";
              e.currentTarget.style.boxShadow = "none";
            }}
            onMouseUp={(e) => {
              if (e.currentTarget.disabled) return;
              e.currentTarget.style.background = "#066A71";
              e.currentTarget.style.border = "2px solid #007C88";
              e.currentTarget.style.boxShadow = "2px 3px 4px 0px #0000001A";
            }}
            onFocus={(e) => {
              if (e.currentTarget.disabled) return;
              e.currentTarget.style.background = "#007C88";
              e.currentTarget.style.border = "0.25px solid #B2E3E6";
              e.currentTarget.style.boxShadow = "0px 8px 12px 0px #0000001A";
            }}
            onBlur={(e) => {
              if (e.currentTarget.disabled) return;
              e.currentTarget.style.background = "#007C88";
              e.currentTarget.style.border = "none";
              e.currentTarget.style.boxShadow = "0px 6px 10px 0px #0000001A";
            }}
            onClick={(e) => {
              if (askDisabled) return;
              setAskDisabled(true);
              setShowAsk(true);
            }}
          >
            <span className="text-[18px] font-medium">+</span>
            Ask Question
          </button>
        </div>
        <div className="flex-grow">
          <MyInterests
            interests={interests}
            questions={questions.questions}
            onQuestionUpdate={handleQuestionUpdate}
            onQuestionDelete={handleQuestionDelete}
            onQuestionLike={handleQuestionLike}
            setInterests={setInterests}
            onInterestUpdate={handleInterestUpdate}
            onCommentCreate={handleCommentCreate}
            onCommentDelete={handleCommentDelete}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
