import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Interest,
  QuestionListItem,
  QuestionsResponse,
} from "../utils/types";
import {
  getAllCategories,
  getPopularQuestions,
  getRecentQuestions,
  searchQuestions,
  getUserInterests,
} from "../utils/store";
import MainLayout from "../components/wrappers/MainLayout";
import SearchBar from "../features/dashboard/searchBar/SearchBar";
import QuestionsSection from "../features/dashboard/questions/QuestionsSection";
import QuestionCreate from "../pages/QuestionCreate"; // adjust the path to where your file is
import AskQuestionButton from "../components/ui/AskQuestionButton";
import MyInterests from "../features/dashboard/interests/MyInterests";

type SearchRequest = {
  query: string;
  categoriesIds: number[];
  hasNone: boolean;
};

type FeedResponse = QuestionsResponse & {
  total?: number;
};

type DashboardLocationState = {
  showQuestionPostedSnackbar?: boolean;
};

const FETCH_BATCH_SIZE = 10;

const INITIAL_QUESTIONS: QuestionsResponse = {
  questions: [],
  count: 0,
  offset: 0,
};

const normalizeQuestionsResponse = (data: FeedResponse): QuestionsResponse => ({
  questions: data.questions,
  count: data.count ?? data.total ?? data.questions.length,
  offset: data.offset,
});

const fetchDashboardQuestions = async (
  tab: "recent" | "popular",
  searchRequest: SearchRequest | null,
  offset: number
): Promise<QuestionsResponse> => {
  if (searchRequest) {
    const data = await searchQuestions({
      ...searchRequest,
      count: FETCH_BATCH_SIZE,
      offset,
    });
    return normalizeQuestionsResponse(data);
  }

  const data =
    tab === "popular"
      ? await getPopularQuestions({ count: FETCH_BATCH_SIZE, offset })
      : await getRecentQuestions({ count: FETCH_BATCH_SIZE, offset });

  return normalizeQuestionsResponse(data);
};

const Dashboard = () => {
  const [questions, setQuestions] = useState<QuestionsResponse>(INITIAL_QUESTIONS);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [tab, setTab] = useState<"recent" | "popular">("recent");
  const [searchRequest, setSearchRequest] = useState<SearchRequest | null>(null);
  const [questionsRefreshKey, setQuestionsRefreshKey] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [showAsk, setShowAsk] = useState(false);
  const [askDisabled, setAskDisabled] = useState(false);
  const [questionTitle, setQuestionTitle] = useState("");
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const [showSuccessSnackbar, setShowSuccessSnackbar] = useState(false);
  const latestRequestRef = useRef(0);
  const location = useLocation();
  const navigate = useNavigate();
  const searchActive = searchRequest !== null;

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
    updatedQuestion: Partial<QuestionListItem> & { id: number }
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
    setInterests((prev) => prev.filter((interest) => interest.question_id !== deletedId));
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

  const handleQuestionCreated = () => {
    setTab("recent");
    setSearchRequest(null);
    setQuestionsRefreshKey((prev) => prev + 1);
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

  useEffect(() => {
    if (!showAsk) setAskDisabled(false);
  }, [showAsk]);

  useEffect(() => {
    const shouldShowSuccessSnackbar = (
      location.state as DashboardLocationState | null
    )?.showQuestionPostedSnackbar;

    if (!shouldShowSuccessSnackbar) {
      return;
    }

    setShowSuccessSnackbar(true);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  useEffect(() => {
    const requestId = ++latestRequestRef.current;
    setQuestions(INITIAL_QUESTIONS);
    setHasMore(false);
    setIsLoadingQuestions(true);

    const loadInitialQuestions = async () => {
      try {
        const data = await fetchDashboardQuestions(tab, searchRequest, 0);
        if (latestRequestRef.current !== requestId) return;

        setQuestions(data);
        setHasMore(data.offset !== -1);
      } catch (error) {
        if (latestRequestRef.current !== requestId) return;
        console.error("Failed to fetch dashboard questions", error);
        setHasMore(false);
      } finally {
        if (latestRequestRef.current === requestId) {
          setIsLoadingQuestions(false);
        }
      }
    };

    void loadInitialQuestions();
  }, [tab, searchRequest, questionsRefreshKey]);

  const handleLoadMoreQuestions = async () => {
    if (isLoadingQuestions || !hasMore) return;

    const nextOffset = questions.offset;
    const requestId = ++latestRequestRef.current;
    setIsLoadingQuestions(true);

    try {
      const data = await fetchDashboardQuestions(tab, searchRequest, nextOffset);
      if (latestRequestRef.current !== requestId) return;

      setQuestions((prev) => ({
        ...data,
        questions: [...prev.questions, ...data.questions],
      }));
      setHasMore(data.offset !== -1);
    } catch (error) {
      if (latestRequestRef.current !== requestId) return;
      console.error("Failed to load more dashboard questions", error);
      setHasMore(false);
    } finally {
      if (latestRequestRef.current === requestId) {
        setIsLoadingQuestions(false);
      }
    }
  };

  return (
    <MainLayout
      searchBar={
        <SearchBar
          onSearchChange={setSearchRequest}
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
              navigate={(path: string, options) => {
                if (path === "/dashboard") {
                  setShowAsk(false);
                  setQuestionTitle("");
                  setShowDiscardModal(false);
                  if (options?.state?.showQuestionPostedSnackbar) {
                    setShowSuccessSnackbar(true);
                  }
                }
              }}
              onQuestionCreated={handleQuestionCreated}
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
              onSearchReset={() => setSearchRequest(null)}
              hasMore={hasMore}
              isLoading={isLoadingQuestions}
              onLoadMore={handleLoadMoreQuestions}
              showSuccessSnackbar={showSuccessSnackbar}
              onSuccessSnackbarClose={() => setShowSuccessSnackbar(false)}
            />
          )}
        </div>
      </div>

      {/* Right Column - My Interests */}
      <div className="col-span-1 flex flex-col gap-6">
        <div className="pt-[20px] pr-[4px]">
          <AskQuestionButton
            disabled={askDisabled}
            onClick={() => {
              setAskDisabled(true);
              setShowAsk(true);
            }}
          />
        </div>

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

    </MainLayout>
  );
};

export default Dashboard;
