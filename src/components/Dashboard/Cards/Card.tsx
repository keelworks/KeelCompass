import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string; // Additional styling for specific cards
  style?: React.CSSProperties; // Inline styles for flexibility
  
}

const Card: React.FC<CardProps> = ({ children, className = "", style = {}}) => {
  return (
    <div
      className={`bg-white shadow-md rounded-lg p-4 ${className}`}
      style={{ ...style }}
     
    >
      {children}
    </div>
  );
};

export default Card;
