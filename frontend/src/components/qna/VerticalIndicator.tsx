import React from "react";

const VerticalIndicator: React.FC = () => {
  return (
    <div
      style={{
        width: "5px", // Fixed width
        height: "288px", // Fixed height
        backgroundColor: "#5CA1BA", // Fixed color
        opacity: '50%', // Fully opaque
        borderTopLeftRadius: "8px", // Rounded top-left corner
        borderBottomLeftRadius: "8px", // Rounded bottom-left corner
      }}
    ></div>
  );
};

export default VerticalIndicator;
