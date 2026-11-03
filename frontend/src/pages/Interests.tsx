import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Interest, QuestionDetail, QuestionListItem } from "../utils/types";
import { getQuestion, getUserInterests } from "../utils/store";
import MainLayout from "../components/wrappers/MainLayout";
import MyInterests from "../features/dashboard/interests/MyInterests";
import AskQuestionButton from "../components/ui/AskQuestionButton";

const InterestsPage = () => {
  const navigate = useNavigate();
  const [interests, setInterests] = useState<Interest[]>([]);
  const [interestQuestions, setInterestQuestions] = useState<QuestionListItem[]>([]);

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

  return (
    <MainLayout>
      {/* Right-side panel: Ask Question + My Interests widget */}
      <div className="col-span-1 lg:col-start-3 flex flex-col gap-6">
        <div className="pt-[20px] pr-[4px]">
          <AskQuestionButton onClick={() => navigate("/questions/new")} />
        </div>

        <MyInterests
          interests={interests}
          questions={interestQuestions}
          onQuestionUpdate={handleQuestionUpdate}
          onQuestionDelete={handleQuestionDelete}
          onQuestionLike={handleQuestionLike}
          setInterests={setInterests}
          onInterestUpdate={refreshInterests}
        />
      </div>
    </MainLayout>
  );
};

export default InterestsPage;
