import React from "react";

interface TagProps {
  label: string; // The text to display inside the tag
}

const Tag: React.FC<TagProps> = ({ label }) => {
  return (
    <div
      className="inline-flex items-center justify-center font-lato"
      style={{
        minWidth: "10px", // Minimum width
        height: "32px", // Fixed height
        borderRadius: "20px", // Rounded corners
        backgroundColor: "rgba(114, 106, 112, 0.1)", // Background with transparency
        padding: "0 10px", // Padding for spacing
      }}
    >
      <span
        style={{
          fontSize: "14px", // Adjust font size
          fontWeight: "500", // Medium weight
          lineHeight: "16px", // Center-align the text vertically
          color: "#42233C", // Text color
        }}
      >
        {label}
      </span>
    </div>
  );
};

export default Tag;
