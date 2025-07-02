import React from "react";

interface InterestItemProps {
  title: string;
  date: string;
}

const InterestItem: React.FC<InterestItemProps> = ({ title, date }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4 relative cursor-pointer">
      <h3 className="text-lg font-normal text-[#004466] leading-relaxed">{title}</h3>
      {date && <div className="absolute bottom-4 right-4 text-sm text-gray-500">{date}</div>}
    </div>
  );
};

export default InterestItem;
