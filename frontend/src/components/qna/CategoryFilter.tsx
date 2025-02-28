import React, { useState } from "react";

interface CategoryFilterProps {
  categories: string[]; // Main categories
  onFilterChange: (mainCategory: string) => void; // Callback for filter updates
}

const CategoryFilter = ({
  categories,
  onFilterChange,
}: CategoryFilterProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0]
  );

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    onFilterChange(category);
  };

  return (
    <div className="flex flex-col space-y-4 font-lato">
      {/* Main Categories with underline for selected */}
      <div className="flex space-x-4" style={{ width: "752px", height: "30px" }}>
        {categories.map((category) => (
          <button
            key={category}
            className={`relative flex items-center justify-center px-4 h-[30px] text-lg transition-all duration-200 ${
              selectedCategory === category
                ? "text-black"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleCategoryChange(category)}
            style={{
              height: "30px",
              padding: "0 12px",
            }}
          >
            <span
              style={{
                fontSize: "16px",
                fontWeight: 400,
                lineHeight: "30px",
                display: "flex",
                alignItems: "center",
              }}
            >
              {category}
              {selectedCategory === category && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500"></div>
            )}
            </span>
            
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
