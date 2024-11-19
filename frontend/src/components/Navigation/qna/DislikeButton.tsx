import React from "react";
import { BiDislike } from "react-icons/bi";
import { BiSolidDislike } from "react-icons/bi";

interface DislikeButtonProps {
  count: number;
  active: boolean;
  onToggle: () => void;
}

const DislikeButton: React.FC<DislikeButtonProps> = ({
  count,
  active,
  onToggle,
}) => {
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
          <BiSolidDislike size={16} color="#626262" />
        ) : (
          <BiDislike size={16} color="#626262" />
        )}
      </div>

      {/* Right Side: Dislike Count */}
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

export default DislikeButton;
