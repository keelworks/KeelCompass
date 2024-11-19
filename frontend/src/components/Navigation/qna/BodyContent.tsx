import React, { useState } from "react";

interface BodyContentProps {
  text: string; // The full content text
  title: string; // Title text to display above the content
}

const BodyContent: React.FC<BodyContentProps> = ({ text, title }) => {
  const [isExpanded, setIsExpanded] = useState(false); // State to track if content is expanded

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Determine the text to display based on expansion state
  const displayText = isExpanded ? text : text.slice(0, 150); // Truncate text to 150 characters when collapsed

  return (
    <div
      className="flex flex-col items-start"
      style={{
        width: "623px", // Fixed width
        height: "auto", // Allow height to adjust dynamically
      }}
    >
      {/* Title Section */}
      <h3 className="font-lato text-lg font-medium text-[#5E7A84]"
        style={{
        //   fontFamily: "Lato",
          fontWeight: 500, // Medium weight
          fontSize: "18px", // Matches your specification
          lineHeight: "24px", // Matches screenshot line height
          color: "#5E7A84", // Matches title color in your screenshot
          marginBottom: "8px", // Space between title and body content
        }}
      >
        {title}
      </h3>

      {/* Body Content */}
      <p 
        className="text-sm font-lato"
        style={{
          //fontFamily: "Lato", // Body font
          fontWeight: 400, // Regular weight for body text
          fontSize: "14px", // Match font size in screenshot
          lineHeight: "21px", // Line height for readability
          color: "#000", // Body text color
          display: "inline", // Inline display for continuation
        }}
      >
        {displayText}
        {!isExpanded && text.length > 150 && (
          <>
            ...{" "}
            <span
              onClick={toggleExpand}
              className="text-blue-500 cursor-pointer font-lato"
              style={{
                //fontFamily: "Lato", // Ensure font consistency
                fontWeight: 500, // Medium weight for emphasis
                fontSize: "14px", // Same as body text
                textDecoration: "underline", // Underline clickable text
                whiteSpace: "nowrap", // Prevent wrapping of "See more"
              }}
            >
              See more
            </span>
          </>
        )}
        {isExpanded && (
          <span
            onClick={toggleExpand}
            className="text-blue-500 cursor-pointer font-lato"
            style={{
              //fontFamily: "Humanist", // Ensure font consistency
              fontWeight: 500, // Medium weight for emphasis
              fontSize: "14px", // Same as body text
              textDecoration: "underline", // Underline clickable text
              whiteSpace: "nowrap", // Prevent wrapping of "See less"
            }}
          >
            {" "}
            See less
          </span>
        )}
      </p>
    </div>
  );
};

export default BodyContent;
