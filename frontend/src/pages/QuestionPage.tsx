import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Interest } from "../utils/types";
import { getUserInterests } from "../utils/store";
import MainLayout from "../components/wrappers/MainLayout";
import AskQuestionButton from "../components/ui/AskQuestionButton";
import QuestionDetails from "../features/dashboard/questions/QuestionDetails";
import { usePageTitle } from "../utils/usePageTitle";

// Fullscreen post view (the /questions/:id route) - the same post+comments
// thread as the popup modal, just taking over the main content area instead
// of floating over it, so a post can go from a quick popup to a full page
// (and so notification links land somewhere real instead of nowhere).
function QuestionPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const questionId = Number(id);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [questionTitle, setQuestionTitle] = useState<string | undefined>(undefined);
  usePageTitle(questionTitle || "Question");

  const refreshInterests = async () => {
    setInterests(await getUserInterests());
  };

  useEffect(() => {
    refreshInterests();
  }, []);

  return (
    <MainLayout>
      <div className="col-span-2 flex flex-col h-full overflow-y-auto">
        {typeof questionId === "number" && !isNaN(questionId) && (
          <QuestionDetails
            questionId={questionId}
            variant="page"
            interests={interests}
            setInterests={setInterests}
            onInterestsUpdate={refreshInterests}
            onQuestionDelete={() => navigate("/dashboard")}
            onTitleChange={setQuestionTitle}
          />
        )}
      </div>

      <div className="col-span-1 flex flex-col">
        <div className="pt-[20px] pr-[4px]">
          <AskQuestionButton onClick={() => navigate("/questions/new")} />
        </div>
      </div>
    </MainLayout>
  );
}

export default QuestionPage;
