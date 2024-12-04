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
      {/* Main Categories */}
      <div className="flex space-x-4">
        {categories.map((category) => (
          <button
            key={category}
            className={`relative flex items-center justify-center px-4 h-[40px] text-lg transition-all duration-200 ${
              selectedCategory === category
                ? "text-black"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleCategoryChange(category)}
            style={{
              height: "40px", // Fixed tab height
              padding: "0 12px", // Space around the text for dynamic width
            }}
          >
            <span
              style={{
                fontSize: "16px", // Font size for main categories
                fontWeight: 400, // Regular font weight
                lineHeight: "40px", // Ensure vertical centering
                display: "flex", // Flexbox to vertically align text
                alignItems: "center", // Vertical centering
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

      {/* Subcategories */}
      <div className="flex space-x-4">
        {subcategories.map((subcategory) => (
          <button
            key={subcategory}
            className={`relative flex items-center justify-center px-4 h-[40px] text-lg transition-all duration-200 ${
              selectedSubcategory === subcategory
                ? "text-black"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleSubcategoryChange(subcategory)}
            style={{
              height: "40px", // Match height with main categories
              padding: "0 12px", // Space around the text for dynamic width
            }}
          >
            <span
              style={{
                fontSize: "16px", // Font size for subcategories
                fontWeight: 400, // Regular font weight
                lineHeight: "40px", // Ensure vertical centering
                display: "flex", // Flexbox to vertically align text
                alignItems: "center", // Vertical centering
              }}
            >
              {subcategory}
            </span>
            {selectedSubcategory === subcategory && (
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue-400"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryFilter;
