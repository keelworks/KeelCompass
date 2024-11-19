import React from "react";
import { BsArrowReturnRight } from "react-icons/bs";

interface ReplyButtonProps {
  label: string;
  onClick: () => void;
}

const ReplyButton: React.FC<ReplyButtonProps> = ({ label, onClick }) => {
  return (
    <button
      className="flex items-center justify-center gap-[8px] rounded-[8px] font-lato"
      style={{
        width: "83px", // Button width
        height: "32px", // Button height
        background: "#D2E3EA", // Button background color
        boxShadow: "0px 1px 2px 0px rgba(10, 13, 18, 0.05)", // Subtle shadow
      }}
      onClick={onClick}
    >
      <div
        className="flex items-center"
        style={{
          width: "59px", // Parent div width
          height: "16px", // Parent div height
        }}
      >
        {/* Left Part */}
        <div
          style={{
            width: "14px",
            height: "14px",
            //background: "var(--Main-Blue-g-KC, #116989)", // Left part background color
            borderRadius: "50%", // Make it circular
            color: "var(--Main-Blue-g-KC, #116989)", // Text color

          }}
          
        ><BsArrowReturnRight /></div>

        {/* Right Part */}
        <div
          style={{
            width: "35px", // Text width
            height: "10px", // Text height
            //fontFamily: "Lato", // Font family
            fontSize: "14px", // Font size
            fontWeight: 500, // Font weight
            lineHeight: "10px", // Matches text height
            textAlign: "left", // Align text to left
            color: "var(--Main-Blue-g-KC, #116989)", // Text color
            marginLeft: "4px", // Add spacing between parts
          }}
        >
          {label}
        </div>
      </div>
    </button>
  );
};

export default ReplyButton;
