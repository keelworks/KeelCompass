import React, { useState } from "react";
import InfoCard from "./InfoCard";

interface InterestCardProps {
  title: string;
  content: string;
  date: string;
}

const InterestCard: React.FC<InterestCardProps> = ({ title, content, date }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  return (
    <InfoCard className="relative cursor-pointer" date={date}>
      <button
        onClick={toggleBookmark}
        // Changed from top-3 to top-6 to move the icon down
        className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition-colors"
        aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
      >
        <svg
          className={`w-5 h-5 ${
            isBookmarked 
              ? 'text-gray-800 fill-current' 
              : 'text-gray-400 fill-white'
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
          />
        </svg>
      </button>

      <h3 className="text-lg font-normal text-[#004466] leading-relaxed">{title}</h3>
      <p className="text-base text-[#616161] leading-[1.5] mb-4">
        {content}
      </p>
    </InfoCard>
  );
};

export default InterestCard;