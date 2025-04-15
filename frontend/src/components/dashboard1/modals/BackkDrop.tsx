import React from "react";

interface BackdropProps {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Backdrop: React.FC<BackdropProps> = ({ children, className = "", style = {} }) => {
  return (
    <div
      className={`shadow-md rounded-lg p-4 ${className}`}
      style={{
        background: "linear-gradient(to bottom, #f8f9fa 0%, #f8f9fa 100%)", // Soft white gradient
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Backdrop;
