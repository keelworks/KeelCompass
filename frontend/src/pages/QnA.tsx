import React from "react";
import Navigation from "../components/Navigation/Navigation";
import QnACard from "../components/qna/QnACard";
import CategoryFilter from "../components/qna/CategoryFilter";

const QnA = () => {
  const categories = ["All", "My Posts", "Education", "Jobs", "Bookmarked"];
  const subcategories = ["Posted", "Pending", "Drafts"];

  const handleFilterChange = (mainCategory: string, subCategory: string) => {
    console.log("Selected Category:", mainCategory);
    console.log("Selected Subcategory:", subCategory);
  };

  return (
    <div>
      <Navigation />
      {/* Add spacing below CategoryFilter */}
      <div className="mb-8">
        <CategoryFilter
          categories={categories}
          subcategories={subcategories}
          onFilterChange={handleFilterChange}
        />
      </div>
      {/* Add spacing above QnACard */}
      <div className="mt-4">
        <QnACard />
      </div>
    </div>
  );
};

export default QnA;
