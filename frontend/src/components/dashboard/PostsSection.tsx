import { useEffect, useState } from "react";
import { QuestionListItem } from "../../utils/types";
import { getRecentQuestions, getPopularQuestions } from "../../utils/store";
import QuestionItem from "./cards/QuestionItem";

function PostsSection() {
  const [tab, setTab] = useState<'recent' | 'popular'>('recent');
  const [count] = useState(10);
  const [offset, setOffset] = useState(0);
  const [questions, setQuestions] = useState<QuestionListItem[]>([]);
  const [selectedQuestionId, setSelectedQuestionId] = useState<number | null>(null);

  const handleToggle = (selected: string) => {
    const mapping: Record<string, 'recent' | 'popular'> = {
      "Most Recent": 'recent',
      "Popular": 'popular',
    };
    setTab(mapping[selected] || 'recent');
  };

  async function fetchQuestions(tabOverride?: 'recent' | 'popular') {
    try {
      let data;
      if ((tabOverride || tab) === 'popular') {
        data = await getPopularQuestions({ count, offset });
      } else {
        data = await getRecentQuestions({ count, offset });
      }
      setQuestions(data.questions);
    } catch (err: any) {
      console.error(err);
      setQuestions([]);
    }
  }
  
  // Update a single question in the questions array
  const handleQuestionUpdated = (updatedQuestion: Partial<QuestionListItem> & { id: number }) => {
    setQuestions(prev => prev.map(q => q.id === updatedQuestion.id ? { ...q, ...updatedQuestion } : q));
  };

  // Remove a question from the questions array
  const handleQuestionDeleted = (deletedId: number) => {
    setQuestions(prev => prev.filter(q => q.id !== deletedId));
  };
  
  useEffect(() => {
    setOffset(0);
    fetchQuestions();
  }, [tab]);

  return (
    <div className="shadow-md rounded-lg p-4 mb-6" style={{ background: 'linear-gradient(to bottom, #f8f9fa 0%, #f8f9fa 100%)', width: '100%' }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium uppercase tracking-wide">Posts</h2>
        <div className="flex items-center bg-gray-200 rounded-md w-fit p-0.5 border border-gray-300">
          {["Most Recent", "Popular"].map((option, index) => (
            <button
              key={option}
              onClick={() => handleToggle(option)}
              className={`px-4 py-2 text-sm font-normal border-r border-gray-300 ${tab === (option === "Most Recent" ? 'recent' : 'popular')
                ? "bg-custom-gradient text-white"
                : "bg-white text-gray-600 hover:bg-gray-300"
                } ${index === 0 ? "rounded-l-md" : ""} ${index === 1 ? "rounded-r-md border-r-0" : ""}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {questions.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <div className="space-y-4 overflow-y-scroll max-h-[80vh]">
          {questions.map((q) => (
            <QuestionItem
              key={q.id}
              questionItem={q}
              selectedQuestionId={selectedQuestionId}
              setSelectedQuestionId={setSelectedQuestionId}
              onQuestionUpdated={handleQuestionUpdated}
              onQuestionDeleted={handleQuestionDeleted}
            />
          ))}
        </div>
      )}

      {offset !== -1 && (
        <div className="mt-4 text-left">
          <button
            onClick={() => {
              setOffset(offset + count);
            }}
            className="bg-custom-gradient bg-clip-text  cursor-pointer text-transparent transition hover:opacity-80"
          >
            View more posts <span className="inline-block w-0 h-0 ml-1 
                  border-l-[5px] border-r-[5px] border-t-[6px]
                  border-l-transparent border-r-transparent border-t-teal-500"></span>
          </button>
        </div>
      )}
    </div>
  );
};

export default PostsSection;
