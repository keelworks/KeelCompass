import React from "react";

interface BackdropProps {
  show: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

const Backdrop: React.FC<BackdropProps> = ({ show, onClose, children }) => {
  if (!show) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose} // Close backdrop on click
    >
      <div
        className="bg-white rounded-lg shadow-lg p-6"
        onClick={(e) => e.stopPropagation()} // Prevent click propagation to backdrop
      >
        {children}
      </div>
    </div>
  );
};

export default Backdrop;
