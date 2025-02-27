import React, { useState } from "react";

interface CategoryFilterProps {
  categories: string[]; // Main categories
  subcategories: string[]; // Subcategories
  onFilterChange: (mainCategory: string, subCategory: string) => void; // Callback for filter updates
}

const CategoryFilter = ({
  categories,
  subcategories,
  onFilterChange,
}: CategoryFilterProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categories[0]
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>(
    subcategories[0]
  );

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setSelectedSubcategory(subcategories[0]); // Reset subcategory on main category change
    onFilterChange(category, subcategories[0]);
  };

  const handleSubcategoryChange = (subcategory: string) => {
    setSelectedSubcategory(subcategory);
    onFilterChange(selectedCategory, subcategory);
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
            </span>
            {selectedCategory === category && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-500"></div>
            )}
          </button>
        ))}
      </div>

      {/* Subcategories with new design and updated size */}
      <div className="flex space-x-4 bg-[#F0F0F0] p-2 rounded-md" style={{ width: "333.92px", height: "42.13px" }}>
        {subcategories.map((subcategory) => (
          <button
            key={subcategory}
            className={`relative flex items-center justify-center px-4 h-[42.13px] text-lg transition-all duration-200 rounded-md ${
              selectedSubcategory === subcategory
                ? "text-[#306E74] bg-white shadow-md"
                : "text-[#306E74] bg-transparent hover:bg-white"
            }`}
            onClick={() => handleSubcategoryChange(subcategory)}
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
  );
};

export default CategoryFilter;
