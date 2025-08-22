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

const PAGE_SIZE = 5;

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
    >
      {/* Middle Column - Questions */}
      <div className="col-span-2 flex flex-col h-full overflow-hidden">
        {/* QuestionsSection scrolls internally */}
        <div className="flex-1 overflow-hidden">
          {showAsk ? (
            <QuestionCreate
              // override navigate calls so it doesn't leave dashboard
              navigate={(path: string) => {
                if (path === "/dashboard") {
                  setShowAsk(false);
                  // optionally reload recent feed
                  setTab("recent");
                  setQuestions({ questions: [], count: PAGE_SIZE, offset: 0 });
                }
              }}
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
            className="w-full h-[48px] flex items-center justify-center gap-2 rounded-[8px]
  bg-[#D2EEF0] text-[#007575] font-medium text-[16px] border border-[#B2E3E6]
  shadow-[0px_8px_18px_0px_#26767B1A] hover:bg-[#BFE3E6] hover:shadow-[4px_12px_22px_0px_#26767B29]
  active:bg-[#7ACFD4] active:border-[1.5px] active:border-[#B2E3E6]
  disabled:bg-[#D2EEF0] disabled:text-[#A5D5D8] disabled:cursor-not-allowed"
            onClick={() => setShowAsk(true)}
          >
            <span className="text-[18px]">+</span> Ask Question
          </button>
        </div>
        <div className="flex-grow">
          <MyInterests interests={interests} questions={questions.questions} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
