import React from "react";


interface QnAStatusProps {
  icon: React.ReactNode;
  statusText: string;
}

const QnAStatus: React.FC<QnAStatusProps> = ({ icon, statusText }) => {
  return (
    <div className="flex items-center font-lato" style={{ height: "16px", width: "84px" }}>
      {/* In Review Frame */}
      <div className="flex items-center" style={{ height: "14px" }}>
        {/* Icon Section */}
        <div
          className="flex justify-center items-center"
          style={{
            width: "8.43px", // Icon width
            height: "10px", // Icon height
            strokeWidth: "1px", // Stroke width
            color: '#828282'
          }}
        >
          {icon}
        </div>

        {/* Status Text */}
        <p
          className="ml-1"
          style={{
            fontSize: "12px", // Font size
            fontWeight: 500, // Medium weight
            lineHeight: "14px", // Matches height
            color: "#828282", // Text color
            textAlign: "left", // Align text to left
            fontStyle: "italic"
          }}
        >
          {statusText}
        </p>
      </div>

      {/* Vertically Aligned Dots */}
      <div
  className="flex flex-col items-center gap-[2px] ml-2"
  style={{
    height: "12px", // Container height
    width: "4px",   // Container width
  }}
>
  <div
    style={{
      width: "3px", // Reduced dot width
      height: "3px", // Reduced dot height
      backgroundColor: "#8B5E83", // Dot color (example color)
      borderRadius: "50%", // Make it circular
    }}
  />
  <div
    style={{
      width: "3px", // Reduced dot width
      height: "3px", // Reduced dot height
      backgroundColor: "#8B5E83", // Dot color (example color)
      borderRadius: "50%", // Make it circular
    }}
  />
  <div
    style={{
      width: "3px", // Reduced dot width
      height: "3px", // Reduced dot height
      backgroundColor: "#8B5E83", // Dot color (example color)
      borderRadius: "50%", // Make it circular
    }}
  />
</div>

    </div>
  );
};

export default QnAStatus;
