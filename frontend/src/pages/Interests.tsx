import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Interest, QuestionDetail, QuestionListItem } from "../utils/types";
import { getQuestion, getUserInterests } from "../utils/store";
import MainLayout from "../components/wrappers/MainLayout";
import AskQuestionButton from "../components/ui/AskQuestionButton";
import QuestionItem from "../features/dashboard/questions/QuestionItem";
import QuestionDetails from "../features/dashboard/questions/QuestionDetails";

const InterestsPage = () => {
  const navigate = useNavigate();
  const [interests, setInterests] = useState<Interest[]>([]);
  const [interestQuestions, setInterestQuestions] = useState<QuestionListItem[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);

  const refreshInterests = async () => {
    setInterests(await getUserInterests());
  };

  useEffect(() => {
    refreshInterests();
  }, []);

  useEffect(() => {
    const questionIds = interests
      .map((interest) => interest.question_id)
      .filter((id): id is number => typeof id === "number" && !Number.isNaN(id));

    if (questionIds.length === 0) {
      setInterestQuestions([]);
      return;
    }

    let isCancelled = false;

    const loadInterestQuestions = async () => {
      const loadedQuestions = await Promise.all(
        questionIds.map(async (id) => {
          try {
            return await getQuestion({ id });
          } catch (error) {
            console.error(`Failed to fetch interest question ${id}`, error);
            return null;
          }
        })
      );

      if (isCancelled) return;

      setInterestQuestions(
        loadedQuestions.filter((q): q is QuestionDetail => q !== null)
      );
    };

    void loadInterestQuestions();

    return () => {
      isCancelled = true;
    };
  }, [interests]);

  const handleQuestionUpdate = (
    updatedQuestion: Partial<QuestionListItem> & { id: number }
  ) => {
    setInterestQuestions((prev) =>
      prev.map((q) => (q.id === updatedQuestion.id ? { ...q, ...updatedQuestion } : q))
    );
  };

  const handleQuestionDelete = (deletedId: number) => {
    setInterestQuestions((prev) => prev.filter((q) => q.id !== deletedId));
    setInterests((prev) => prev.filter((interest) => interest.question_id !== deletedId));
  };

  const handleQuestionLike = (
    questionId: number,
    hasLiked: boolean,
    likeCount: number
  ) => {
    setInterestQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, hasLiked, likeCount } : q))
    );
  };

  const handleCommentCreate = (questionId: number) => {
    setInterestQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, commentCount: (q.commentCount ?? 0) + 1 } : q
      )
    );
  };

  const handleCommentDelete = (questionId: number) => {
    setInterestQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId
          ? { ...q, commentCount: Math.max((q.commentCount ?? 0) - 1, 0) }
          : q
      )
    );
  };

  return (
    <MainLayout>
      {/* Left Column - full post cards, same as the Home page */}
      <div className="col-span-2 flex flex-col h-full overflow-hidden">
        <div className="shadow-md rounded-lg p-4 mb-6 bg-gray-50 dark:bg-gray-800 w-full h-full flex flex-col overflow-hidden">
          <div className="mb-4 flex-shrink-0">
            <h2 className="text-xl font-medium uppercase tracking-wide text-gray-900 dark:text-gray-100">
              My Interests
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-4">
            {interestQuestions.length === 0 ? (
              <p className="text-gray-600 dark:text-gray-300">No interests found.</p>
            ) : (
              interestQuestions.map((question) => (
                <div key={question.id}>
                  <QuestionItem
                    question={question}
                    onQuestionLike={handleQuestionLike}
                    interests={interests}
                    setInterests={setInterests}
                    onInterestUpdate={refreshInterests}
                    setSelectedQuestionId={setSelectedQuestionId}
                  />
                  <hr className="border-gray-200 dark:border-gray-700" />
                </div>
              ))
            )}
          </div>
        </div>

        {typeof selectedQuestionId === "number" && !isNaN(selectedQuestionId) && (
          <QuestionDetails
            questionId={selectedQuestionId}
            onQuestionUpdate={handleQuestionUpdate}
            onQuestionDelete={handleQuestionDelete}
            onQuestionLike={handleQuestionLike}
            interests={interests}
            setInterests={setInterests}
            onInterestsUpdate={refreshInterests}
            onCommentCreate={handleCommentCreate}
            onCommentDelete={handleCommentDelete}
            onClose={() => setSelectedQuestionId(null)}
          />
        )}
      </div>

      {/* Right Column */}
      <div className="col-span-1 flex flex-col">
        <div className="pt-[20px] pr-[4px]">
          <AskQuestionButton onClick={() => navigate("/questions/new")} />
        </div>
      </div>
    </MainLayout>
  );
};

export default InterestsPage;
