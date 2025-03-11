import React from "react";

interface BackdropProps {
  children: React.ReactNode; // Content inside the backdrop
  className?: string; // Custom class names for styling
  style?: React.CSSProperties; // Inline styles for flexibility
}

const Backdrop: React.FC<BackdropProps> = ({ children, className = "", style = {} }) => {
  return (
    <div
      className={`bg-gray-50 shadow-md rounded-lg p-4 ${className}`}
      style={{ ...style }}
    >
      {children}
    </div>
  );
};

export default Backdrop;