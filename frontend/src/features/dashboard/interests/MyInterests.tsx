import { useState } from 'react';
import { Bookmark } from 'lucide-react';
//import { formatDate } from '../../../utils/format';
import { Interest, QuestionListItem } from '../../../utils/types';
import InterestItem from './InterestItem';

interface MyInterstProps {
  interests: Interest[];
  questions: QuestionListItem[];
}

const MyInterests = ({ interests, questions }: MyInterstProps) => {
  const [showAll, setShowAll] = useState(false);
  
  const formatLongDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };
  // Function to get comment count for a specific question ID
  const getCommentCount = (questionId: number): number => {
    const question = questions.find(q => q.id === questionId);
    return question?.commentCount || 0;
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col h-full p-6 bg-white shadow-md rounded-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-medium text-[#4A4A4A] uppercase tracking-wide">
            My Interests
          </h2>
          <div className="w-5 h-5 bg-[#007575] rounded-sm flex items-center justify-center">
            <Bookmark size={12} className="text-white fill-white" />
          </div>
        </div>

        {/* Container with conditional scrolling */}
        <div className={`flex flex-col space-y-4 flex-grow`}>
          {interests.length > 0 ? (
            (showAll ? interests : interests.slice(0, 3)).map((interest) => (
              <InterestItem
                key={interest.id}
                title={interest.question?.title || ''}
                date={formatLongDate(interest.created_at)}
                commentCount={getCommentCount(interest.question_id || 0)}
              />
            ))
          ) : (
            <div className="flex justify-center items-center flex-grow">
              <p className="text-gray-500">No interests found</p>
            </div>
          )}
        </div>

        {/* Simple View All Link - matching the design */}
        {interests.length > 3 && (
          <div className="mt-6">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-[#007575] hover:text-[#005555] font-medium flex items-center gap-1 transition-colors duration-200"
            >
              <span>
                {showAll ? 'Show Less' : 'View all My Interests'}
              </span>
              <span className="text-[#007575]">→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyInterests;