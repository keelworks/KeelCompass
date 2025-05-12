import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string; // Additional styling for specific cards
  style?: React.CSSProperties; // Inline styles for flexibility
  date: string
}

const Card1: React.FC<CardProps> = ({ date, children, className = "", style = {}}) => {
  return (
    <div
      className={`bg-white shadow-md rounded-lg p-4 ${className}`}
      style={{ ...style }}>

    <div className="absolute top-4 right-4">
        {/* <img
          src="/images/bookmark.svg" // Replace with your bookmark icon path
          alt="Bookmark"
          className="w-4 h-4 cursor-pointer"
        /> */}

        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-5 h-5 text-gray-500 cursor-pointer"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M17.25 6.75V21l-5.25-3.25L6.75 21V6.75A2.25 2.25 0 019 4.5h6a2.25 2.25 0 012.25 2.25z"
          />
        </svg>

    </div>
    <div className="card-content">
      {children}
    </div>

    {date && (
        <div className="absolute bottom-4 right-4 text-sm text-gray-500">
          {date}
        </div>
      )}
      </div>
  );
};

export default Card1;