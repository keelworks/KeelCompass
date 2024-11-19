import React from "react";
import { MdKeyboardDoubleArrowDown } from "react-icons/md";
interface ShowAllRepliesButtonProps {
  label: string;
  onClick: () => void;
}

const ShowAllRepliesButton: React.FC<ShowAllRepliesButtonProps> = ({
  label,
  onClick,
}) => {
  return (
    <button
      className="flex items-center justify-center gap-[8px] rounded-[8px] font-lato"
      style={{
        height: "32px", // Button height
        background: "#FFFFFF", // Button background color
        border: "1px solid rgba(17, 105, 137, 0.5)", // Button border color
        boxShadow: "0px 1px 2px 0px rgba(10, 13, 18, 0.05)", // Subtle shadow
        padding: "8px 12px", // Padding for content
      }}
      onClick={onClick}
    >
      <div
        className="flex items-center"
        style={{
          height: "16px", // Parent div height
        }}
      >
        {/* Left Part: Icon */}
        <div
          style={{
            width: "14px", // Icon container width
            height: "14px", // Icon container height
            color: "var(--Main-Blue-g-KC, #116989)", // Icon color
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <MdKeyboardDoubleArrowDown size={14} />
        </div>

        {/* Right Part: Text */}
        <div
          style={{
            fontSize: "14px", // Font size
            fontWeight: 500, // Font weight
            lineHeight: "16px", // Matches text height
            textAlign: "left", // Align text to left
            color: "var(--Main-Blue-g-KC, #116989)", // Text color
            marginLeft: "4px", // Add spacing between icon and text
          }}
        >
          {label}
        </div>
      </div>
    </button>
  );
};

export default ShowAllRepliesButton;
