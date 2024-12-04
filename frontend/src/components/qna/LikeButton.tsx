import React from "react";
import { BiLike } from "react-icons/bi";
import { BiSolidLike } from "react-icons/bi";

interface LikeButtonProps {
  count: number;
  active: boolean;
  onToggle: () => void;
}

const LikeButton: React.FC<LikeButtonProps> = ({ count, active, onToggle }) => {
  return (
    <button
      className="flex items-center justify-center"
      style={{
        width: "28px", // Button width
        height: "17px", // Button height
        background: "transparent", // Transparent background
        border: "none", // No border
        cursor: "pointer", // Pointer cursor for interaction
        display: "flex", // Flex for alignment
        gap: "2px", // Add a 2px gap between icon and number
      }}
      onClick={onToggle}
    >
      {/* Left Side: Icon */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "16px", // Icon width
          height: "16px", // Icon height
        }}
      >
        {active ? (
          <BiSolidLike size={16} color="#626262" />
        ) : (
          <BiLike size={16} color="#626262" />
        )}
      </div>

      {/* Right Side: Like Count */}
      <div
        style={{
          display: "flex",
          alignItems: "center", // Center align text vertically
          justifyContent: "center", // Center align text horizontally
          width: "9px", // Fixed width
          fontSize: "13px", // Font size for number
          color: "#626262", // Text color
        }}
      >
        {count}
      </div>
    </button>
  );
};

export default LikeButton;
