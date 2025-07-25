import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Interest, QuestionsResponse } from "../utils/types";
import { getAllCategories, getPopularQuestions, getRecentQuestions, getUserInterests } from "../utils/store";
import MainLayout from "../components/wrappers/MainLayout";
import SearchBar from "../features/dashboard/searchBar/SearchBar";
import QuestionsSection from "../features/dashboard/questions/QuestionsSection";
import MyInterests from "../features/dashboard/interests/MyInterests";

const PAGE_SIZE = 5;

const Dashboard = () => {
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<QuestionsResponse>({
    questions: [],
    count: PAGE_SIZE,
    offset: 0,
  });
  const [interests, setInterests] = useState<Interest[]>([]);
  const [tab, setTab] = useState<'recent' | 'popular'>('recent');
  const [searchActive, setSearchActive] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const handleQuestionUpdate = (updatedQuestion: Partial<QuestionsResponse> & { id: number }) => {
    setQuestions(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === updatedQuestion.id ? { ...q, ...updatedQuestion } : q
      ),
    }));
  };

  const handleQuestionDelete = (deletedId: number) => {
    setQuestions(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== deletedId),
    }));
  };

  const handleQuestionLike = (questionId: number, hasLiked: boolean, likeCount: number) => {
    setQuestions(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId ? { ...q, hasLiked, likeCount } : q
      ),
    }));
  };

  const handleInterestUpdate = async () => {
    setInterests(await getUserInterests());
  };

  const handleCommentCreate = (questionId: number) => {
    setQuestions(prev => ({
      ...prev,
      questions: prev.questions.map(q =>
        q.id === questionId
          ? { ...q, commentCount: (q.commentCount ?? 0) + 1 }
          : q
      ),
    }));
  }

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
      if (tab === 'popular') {
        data = await getPopularQuestions({ count: PAGE_SIZE, offset });
      } else {
        data = await getRecentQuestions({ count: PAGE_SIZE, offset });
      }
      setQuestions(prev => ({
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
    <MainLayout>
      <div className="col-span-2 flex flex-col">
        {/* Middle */}
        <div className="flex items-center justify-between mb-6" style={{ width: "676px", height: "44px" }}>
          <div className="w-full">
            <SearchBar
              pageSize={PAGE_SIZE}
              setQuestions={setQuestions}
              setSearchActive={setSearchActive}
            />
          </div>
        </div>
        <QuestionsSection
          questions={{
            ...questions,
            questions: questions.questions.map(q => {
              const found = interests.find(i => i.question_id === q.id);
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
          tab={tab}
          setTab={setTab}
          searchActive={searchActive}
          setSearchActive={setSearchActive}
          hasMore={hasMore}
          pageSize={PAGE_SIZE}
        />
      </div>

      {/* Right */}
      <div className="col-span-1 flex flex-col">
        <div className="mb-8">
          <button className="bg-custom-gradient text-white font-medium w-full py-3 rounded-lg hover:bg-teal-500/90 transition duration-200" onClick={() => navigate('/questions/new')}>
            Ask Question
          </button>
        </div>
        <div className="flex-grow">
          <MyInterests interests={interests} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
