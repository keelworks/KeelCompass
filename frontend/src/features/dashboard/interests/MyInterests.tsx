import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { formatDate } from '../../../utils/format';
import { Interest } from '../../../utils/types';
import InterestItem from './InterestItem';

interface MyInterstProps {
  interests: Interest[];
}

const MyInterests = ({ interests }: MyInterstProps) => {
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="flex flex-col h-full">
      <div className="flex flex-col h-full p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-xl font-medium text-[#4A4A4A] uppercase tracking-wide mb-6">
          My Interests
        </h2>

        {/* UPDATED: Container with conditional scrolling */}
        <div className={`flex flex-col space-y-4 flex-grow`}>
          {interests.length > 0 ? (
            (showAll ? interests : interests.slice(0, 4)).map((interest) => (
              <InterestItem
                key={interest.id}
                title={interest.question?.title || ''}
                date={formatDate(interest.created_at)}
              />
            ))
          ) : (
            <div className="flex justify-center items-center flex-grow">
              <p className="text-gray-500">No interests found</p>
            </div>
          )}
        </div>

        {/* NEW: View All / Show Less Button */}
        {interests.length > 4 && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#007880] to-[#00a0aa] text-white font-medium text-sm rounded-lg shadow-md hover:shadow-lg hover:from-[#005a61] hover:to-[#007880] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#007880] focus:ring-opacity-50"
            >
              <span className="transition-all duration-200">
                {showAll ? 'Show Less' : 'View All My Interests'}
              </span>
              <div className="transition-transform duration-200 group-hover:scale-110">
                {showAll ? (
                  <ChevronUp
                    size={16}
                    className="transition-transform duration-200"
                  />
                ) : (
                  <ChevronDown
                    size={16}
                    className="transition-transform duration-200"
                  />
                )}
              </div>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyInterests;
