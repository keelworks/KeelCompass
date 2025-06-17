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