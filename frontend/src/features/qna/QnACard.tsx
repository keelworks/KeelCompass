import { useState, useEffect } from "react";

interface QnACard2Props {
  subcategories: string[];
  selectedMainCategory: string;
}

const QnACard2 = ({
  subcategories,
  selectedMainCategory,

}: QnACard2Props) => {
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(
    subcategories[0]
  );

  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
  };

  useEffect(() => {
    setSelectedSubcategory(subcategories[0]);
  }, [selectedMainCategory, subcategories]);

  return (
    <div
      className="shadow-md rounded-md p-6 flex w-full bg-white dark:bg-gray-800"
      style={{
        minHeight: "480.13px",
        borderRadius: "7px",
        padding: "24px",
        marginTop: "10px",
        gap: "10px",
      }}
    >
      <div
        className="flex flex-col bg-white dark:bg-gray-800 p-4 rounded-md w-full"
        style={{ gap: "32px" }}
      >
        <div
          className="flex flex-wrap gap-4 bg-[#F0F0F0] dark:bg-gray-700 p-2 rounded-md w-fit max-w-full"
          style={{ padding: "4px" }}
        >
          {subcategories.map((subcategory) => (
            <button
              key={subcategory}
              className={`flex items-center justify-center px-4 h-full text-lg transition-all duration-200 rounded-md shadow-sm ${
                selectedSubcategory === subcategory
                  ? "text-[#306E74] dark:text-teal-300 bg-white dark:bg-gray-900 shadow-md"
                  : "text-[#306E74] dark:text-teal-300 bg-transparent hover:bg-[#E0E0E0] dark:hover:bg-gray-600"
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
