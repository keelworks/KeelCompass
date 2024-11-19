import React from "react";

interface QnAUserNameProps {
  icon: React.ReactNode;
  name: string;
  time: string;
}

const QnAUserName: React.FC<QnAUserNameProps> = ({ icon, name, time }) => {
  return (
    <div
      className="flex items-center gap-[10px] font-lato"
      style={{
        width: "185px", // Container width
        height: "36px", // Container height
        lineHeight: "36px", // Center-align content vertically
      }}
    >
      {/* Icon Section */}
      <div
        style={{
          width: "28px", // Icon container width
          height: "28px", // Icon container height
        }}
      >
        {icon}
      </div>

      {/* Text Section */}
      <div>
        {/* Name Section */}
        <p
          className="text-sm font-medium"
          style={{
            fontWeight: 400, // Medium weight
            fontSize: "14px", // Font size
            lineHeight: "17px", // Line height
            color: "#5E7A84", // Softer gray-blue color
            width: "64px", // Name text width
            height: "17px", // Name text height
            overflow: "hidden", // Prevent overflow
            whiteSpace: "nowrap", // Prevent text wrapping
            textOverflow: "ellipsis", // Add ellipsis if the text is too long
            marginBottom: "1px", // Add 1px gap below name
          }}
        >
          {name}
        </p>

        {/* Time Section */}
        <p
          className="text-xs text-gray-500"
          style={{
            fontSize: "12px", // Font size
            fontWeight: 400, // Regular weight
            lineHeight: "14px", // Line height
            color: "#828282", // Text color for "time" section
            width: "147px", // Time text width
            height: "14px", // Time text height
            overflow: "hidden", // Prevent overflow
            whiteSpace: "nowrap", // Prevent text wrapping
            textOverflow: "ellipsis", // Add ellipsis if text is too long
          }}
        >
          {time}
        </p>
      </div>
    </div>
  );
};

export default QnAUserName;
