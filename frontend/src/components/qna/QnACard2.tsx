import React, { useState, useEffect } from "react";

interface QnACard2Props {
  subcategories: string[];
  selectedMainCategory: string;
}

const QnACard2 = ({ subcategories, selectedMainCategory }: QnACard2Props) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(
    subcategories[0]
  );

  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
  };

  // Reset subcategory to "Posted" when main category changes
  useEffect(() => {
    setSelectedSubcategory(subcategories[0]);
  }, [selectedMainCategory, subcategories]);

  return (
    <div
      className="shadow-md rounded-md p-6"
      style={{
        width: "740px",
        height: "480.13px",
        borderRadius: "7px",
        padding: "24px",
        marginTop: "156px",
        marginLeft: "262px",
        gap: "10px",
        background: "linear-gradient(0deg, #FFFFFF 0%, #FFFFFF 100%)",
      }}
    >
      <div
        className="flex flex-col bg-[#FFFFFF] p-4 rounded-md"
        style={{ width: "692px", height: "432.13px", gap: "32px" }}
      >
        <div
          className="flex space-x-4 bg-[#F0F0F0] p-2 rounded-md"
          style={{ width: "333.92px", height: "42.13px", padding: "4px" }}
        >
          {subcategories.map((subcategory) => (
            <button
              key={subcategory}
              className={`flex items-center justify-center px-4 h-full text-lg transition-all duration-200 rounded-md shadow-sm ${
                selectedSubcategory === subcategory
                  ? "text-[#306E74] bg-white shadow-md"
                  : "text-[#306E74] bg-transparent hover:bg-[#E0E0E0]"
              }`}
              onClick={() => handleSubcategoryChange(subcategory)}
              style={{
                minWidth: "100px",
                padding: "5px 10px",
              }}
            >
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: 500,
                  lineHeight: "42.13px",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                {subcategory}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QnACard2;
