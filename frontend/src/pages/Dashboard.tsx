import { useEffect, useRef, useState } from "react";
import {
  Interest,
  QuestionDetail,
  QuestionListItem,
  QuestionsResponse,
} from "../utils/types";
import {
  getAllCategories,
  getPopularQuestions,
  getQuestion,
  getRecentQuestions,
  searchQuestions,
  getUserInterests,
} from "../utils/store";
import MainLayout from "../components/wrappers/MainLayout";
import SearchBar from "../features/dashboard/searchBar/SearchBar";
import QuestionsSection from "../features/dashboard/questions/QuestionsSection";
import MyInterests from "../features/dashboard/interests/MyInterests";
import QuestionCreate from "../pages/QuestionCreate"; // adjust the path to where your file is

type SearchRequest = {
  query: string;
  categoriesIds: number[];
  hasNone: boolean;
};

type FeedResponse = QuestionsResponse & {
  total?: number;
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

const mergeQuestionCache = (
  currentQuestions: QuestionListItem[],
  incomingQuestions: Array<QuestionListItem | QuestionDetail>
): QuestionListItem[] => {
  if (incomingQuestions.length === 0) {
    return currentQuestions;
  }

  const questionMap = new Map(
    currentQuestions.map((question) => [question.id, question])
  );

  incomingQuestions.forEach((question) => {
    const existingQuestion = questionMap.get(question.id);
    questionMap.set(
      question.id,
      existingQuestion ? { ...existingQuestion, ...question } : question
    );
  });

  return Array.from(questionMap.values());
};

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
  const [interestQuestions, setInterestQuestions] = useState<QuestionListItem[]>(
    []
  );
  const [tab, setTab] = useState<"recent" | "popular">("recent");
  const [searchRequest, setSearchRequest] = useState<SearchRequest | null>(null);
  const [questionsRefreshKey, setQuestionsRefreshKey] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [showAsk, setShowAsk] = useState(false);
  const [askDisabled, setAskDisabled] = useState(false);
  const [questionTitle, setQuestionTitle] = useState("");
  const [showDiscardModal, setShowDiscardModal] = useState(false);
  const latestRequestRef = useRef(0);
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
    setInterestQuestions((prev) =>
      prev.map((q) =>
        q.id === updatedQuestion.id ? { ...q, ...updatedQuestion } : q
      )
    );
  };

  const handleQuestionDelete = (deletedId: number) => {
    setQuestions((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== deletedId),
    }));
    setInterestQuestions((prev) => prev.filter((q) => q.id !== deletedId));
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
    setInterestQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, hasLiked, likeCount } : q
      )
    );
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
    setInterestQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? { ...q, commentCount: (q.commentCount ?? 0) + 1 }
          : q
      )
    );
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
    setInterestQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? { ...q, commentCount: Math.max((q.commentCount ?? 0) - 1, 0) }
          : q
      )
    );
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
    const interestQuestionIds = new Set(
      interests
        .map((interest) => interest.question_id)
        .filter(
          (questionId): questionId is number =>
            typeof questionId === "number" && !Number.isNaN(questionId)
        )
    );

    if (interestQuestionIds.size === 0 || questions.questions.length === 0) {
      return;
    }

    const matchingQuestions = questions.questions.filter((question) =>
      interestQuestionIds.has(question.id)
    );

    if (matchingQuestions.length === 0) {
      return;
    }

    setInterestQuestions((prev) => mergeQuestionCache(prev, matchingQuestions));
  }, [interests, questions.questions]);

  useEffect(() => {
    const interestQuestionIds = interests
      .map((interest) => interest.question_id)
      .filter(
        (questionId): questionId is number =>
          typeof questionId === "number" && !Number.isNaN(questionId)
      );

    if (interestQuestionIds.length === 0) {
      return;
    }

    const cachedQuestionIds = new Set(
      interestQuestions.map((question) => question.id)
    );
    const missingQuestionIds = interestQuestionIds.filter(
      (questionId) => !cachedQuestionIds.has(questionId)
    );

    if (missingQuestionIds.length === 0) {
      return;
    }

    let isCancelled = false;

    const loadMissingInterestQuestions = async () => {
      const loadedQuestions = await Promise.all(
        missingQuestionIds.map(async (questionId) => {
          try {
            return await getQuestion({ id: questionId });
          } catch (error) {
            console.error(
              `Failed to fetch interest question ${questionId}`,
              error
            );
            return null;
          }
        })
      );

      if (isCancelled) {
        return;
      }

      const fetchedQuestions = loadedQuestions.filter(
        (question): question is QuestionDetail => question !== null
      );

      if (fetchedQuestions.length === 0) {
        return;
      }

      setInterestQuestions((prev) =>
        mergeQuestionCache(prev, fetchedQuestions)
      );
    };

    void loadMissingInterestQuestions();

    return () => {
      isCancelled = true;
    };
  }, [interests, interestQuestions]);

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
              navigate={(path: string) => {
                if (path === "/dashboard") {
                  setShowAsk(false);
                  setQuestionTitle("");
                  setShowDiscardModal(false);
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
            />
          )}
        </div>
      </div>

      {/* Right Column - My Interests */}
      <div className="col-span-1 flex flex-col">
        <div className="mb-8 pt-[4px] pr-[4px]">
          <button
            disabled={askDisabled}
            className="w-full h-[38px] flex items-center justify-center gap-[8px]
    rounded-[9px] text-white font-medium text-[16px]
    transition-all duration-150 focus:outline-none
    disabled:cursor-not-allowed"
            style={{
              background: askDisabled ? "#007C8833" : "#007C88",
              border: "none",
              borderRadius: askDisabled ? "8px" : "9px",
              boxShadow: askDisabled ? "none" : "0px 6px 10px 0px #0000001A",
              outline: "none",
              outlineOffset: "0px",
              padding: "16px",
              minWidth: "296px",
              transform: askDisabled ? "translate(-4px, 4px)" : "none",
            }}
            onMouseEnter={(e) => {
              if (e.currentTarget.disabled) return;
              e.currentTarget.style.background = "#066A71";
              e.currentTarget.style.border = "none";
              e.currentTarget.style.boxShadow = "2px 3px 4px 0px #0000001A";
              e.currentTarget.style.outline = "2px solid #007C88";
              e.currentTarget.style.outlineOffset = "2px";
            }}
            onMouseLeave={(e) => {
              if (e.currentTarget.disabled) return;
              e.currentTarget.style.background = "#007C88";
              e.currentTarget.style.border = "none";
              e.currentTarget.style.boxShadow = "0px 6px 10px 0px #0000001A";
              e.currentTarget.style.outline = "none";
              e.currentTarget.style.outlineOffset = "0px";
            }}
            onMouseDown={(e) => {
              e.currentTarget.focus();
              if (e.currentTarget.disabled) return;
              e.currentTarget.style.background = "#409EA5";
              e.currentTarget.style.border = "none";
              e.currentTarget.style.boxShadow = "none";
              e.currentTarget.style.outline = "2px solid #007C88";
              e.currentTarget.style.outlineOffset = "2px";
            }}
            onMouseUp={(e) => {
              if (e.currentTarget.disabled) return;
              e.currentTarget.style.background = "#066A71";
              e.currentTarget.style.border = "none";
              e.currentTarget.style.boxShadow = "2px 3px 4px 0px #0000001A";
              e.currentTarget.style.outline = "2px solid #007C88";
              e.currentTarget.style.outlineOffset = "2px";
            }}
            onFocus={(e) => {
              if (e.currentTarget.disabled) return;
              e.currentTarget.style.background = "#007C88";
              e.currentTarget.style.border = "none";
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
              const button = e.currentTarget;
              button?.style.setProperty("outline", "none");
              button?.style.setProperty("outline-offset", "0px");
              button?.style.setProperty("border", "none");
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
            questions={interestQuestions}
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
