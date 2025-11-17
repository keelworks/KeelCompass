import { useState } from "react";
import BookmarkIcon from "../../../assets/Bookmark.svg";
import QuestionDetails from "../questions/QuestionDetails";
import { Interest, QuestionListItem } from "../../../utils/types";
import InterestItem from "./InterestItem";

interface MyInterstProps {
  interests: Interest[];
  questions: QuestionListItem[];
  onQuestionUpdate?: (
    updatedQuestion: Partial<QuestionListItem> & { id: number }
  ) => void;
  onQuestionDelete?: (deletedId: number) => void;
  onQuestionLike?: (
    questionId: number,
    hasLiked: boolean,
    likeCount: number
  ) => void;
  setInterests?: (interests: Interest[]) => void;
  onInterestUpdate?: () => void;
  onCommentCreate?: (questionId: number) => void;
  onCommentDelete?: (commentId: number) => void;
}

const MyInterests = ({
  interests,
  questions,
  onQuestionUpdate,
  onQuestionDelete,
  onQuestionLike,
  setInterests,
  onInterestUpdate,
  onCommentCreate,
  onCommentDelete,
}: MyInterstProps) => {
  const [showAll, setShowAll] = useState(false);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(
    null
  );

  const formatLongDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCommentCount = (questionId: number): number => {
    const question = questions.find((q) => q.id === questionId);
    return question?.commentCount || 0;
  };

  const handleQuestionUpdateLocal = (
    updatedQuestion: Partial<QuestionListItem> & { id: number }
  ) => {
    if (onQuestionUpdate) {
      onQuestionUpdate(updatedQuestion);
    }
  };

  const handleQuestionDeleteLocal = (deletedId: number) => {
    if (onQuestionDelete) {
      onQuestionDelete(deletedId);
    }
    setSelectedQuestionId(null);
  };

  const handleQuestionLikeLocal = (
    questionId: number,
    hasLiked: boolean,
    likeCount: number
  ) => {
    if (onQuestionLike) {
      onQuestionLike(questionId, hasLiked, likeCount);
    }
  };

  const handleCommentCreateLocal = (questionId: number) => {
    if (onCommentCreate) {
      onCommentCreate(questionId);
    }
  };

  const handleCommentDeleteLocal = (questionId: number) => {
    if (onCommentDelete) {
      onCommentDelete(questionId);
    }
  };

  const handleInterestUpdateLocal = () => {
    if (onInterestUpdate) {
      onInterestUpdate();
    }
  };

  const handleInterestItemClick = (questionId: number) => {
    setSelectedQuestionId(questionId);
  };

  return (
    <div className="flex flex-col h-full">
      <div
        className="flex flex-col h-full p-6 bg-white shadow-md rounded-lg"
        style={{ background: "#EFEFEF" }}
      >
        <div className="flex items-center justify-between mb-6">
          <h2
            style={{
              width: "229px",
              height: "28px",
              opacity: 1,
              fontFamily: "Raleway, sans-serif",
              fontWeight: 600,
              fontStyle: "normal",
              fontSize: "24px",
              lineHeight: "100%",
              letterSpacing: "0%",
              verticalAlign: "middle",
              color: "#212121",
            }}
          >
            My Interests
          </h2>

          <div className="flex items-center">
            <img
              src={BookmarkIcon}
              srcSet={`${BookmarkIcon} 1x`}
              alt="Bookmark"
              style={{
                width: "20px",
                height: "20px",
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        <div
          className={`flex flex-col space-y-4 transition-all duration-300 ${
            showAll && interests.length > 3 ? "flex-1 overflow-y-auto pr-2" : ""
          }`}
          style={{
            maxHeight:
              showAll && interests.length > 3 ? "calc(100vh - 300px)" : "none",
          }}
        >
          {interests.length > 0 ? (
            (showAll ? interests : interests.slice(0, 3)).map((interest) => {
              // 🔥 CHANGED: Always use live question data (no fallback to cached data)
              const liveQuestion = questions.find(
                (q) => q.id === interest.question_id
              );

              return (
                <InterestItem
                  key={interest.id}
                  title={liveQuestion?.title || ""}
                  date={formatLongDate(interest.created_at)}
                  commentCount={liveQuestion?.commentCount || 0}
                  onClick={() =>
                    handleInterestItemClick(interest.question_id || 0)
                  }
                />
              );
            })
          ) : (
            <div className="flex justify-center items-center flex-grow">
              <p className="text-gray-500">No interests found</p>
            </div>
          )}
        </div>

        {interests.length > 3 && (
          <div
            className="mt-6 flex justify-start"
            style={{ paddingLeft: "7px" }} // same as card padding for alignment
          >
            <button
              onClick={() => setShowAll(!showAll)}
              style={{
                width: "173px",
                height: "44px",
                gap: "4px",
                opacity: 1,
                background: "transparent",
                color: "#2C7A7B",
                fontFamily: "Lato, sans-serif",
                fontWeight: 500,
                fontSize: "18px",
                lineHeight: "24px",
                letterSpacing: "0%",
                border: "none",
                borderRadius: "0",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                whiteSpace: "nowrap",
              }}
              className="transition-colors duration-200 hover:text-[#005E64]"
            >
              <span>
                {showAll ? "Show less interests" : "View more interests"}
              </span>
              <span
                style={{
                  fontSize: "18px",
                  marginBottom: "10px",
                }}
              >
                ⌄
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Modal */}
      {typeof selectedQuestionId === "number" &&
        !isNaN(selectedQuestionId) &&
        selectedQuestionId > 0 && (
          <QuestionDetails
            questionId={selectedQuestionId}
            onQuestionUpdate={handleQuestionUpdateLocal}
            onQuestionDelete={handleQuestionDeleteLocal}
            onQuestionLike={handleQuestionLikeLocal}
            interests={interests}
            setInterests={setInterests || (() => {})}
            onInterestsUpdate={handleInterestUpdateLocal}
            onCommentCreate={handleCommentCreateLocal}
            onCommentDelete={handleCommentDeleteLocal}
            onClose={() => setSelectedQuestionId(null)}
          />
        )}
    </div>
  );
};

export default MyInterests;
