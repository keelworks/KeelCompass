import React from "react";
import Navigation from "../components/Navigation/Navigation";
import QnACard from "../components/qna/QnACard";
import CategoryFilter from "../components/qna/CategoryFilter";
import { CiSearch } from "react-icons/ci";

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
      {/* Wrapper div for the rest of the content */}
      <div>
        {/* Add div with heading and search bar */}
        <div
          className="flex items-center justify-between mb-6"
          style={{
            width: "676px",
            height: "44px",
          }}
        >
          {/* Q&A Discussions Heading */}
          <h1
            className="font-lato font-medium text-[26px] text-[#444444]"
            style={{
              width: "272px",
              height: "25px",
              lineHeight: "25px",
              textAlign: "left",
            }}
          >
            Q&A Discussions
          </h1>

          {/* Search Bar */}
          <div
            className="flex items-center"
            style={{
              width: "236px",
              height: "44px",
              backgroundColor: "#FFFFFF", // White background
              padding: "5px 10px", // Padding inside the bar
            }}
          >
            {/* Input Field */}
            <input
              type="text"
              placeholder="Search"
              className="w-full h-full bg-transparent text-black text-sm font-lato focus:outline-none"
              style={{
                marginRight: "10px", // Space between input and the icon placeholder
              }}
            />

            {/* Icon */}
            <div
              className="flex items-center justify-center"
              style={{
                width: "32px", // Icon container width
                height: "32px", // Icon container height
              }}
            >
              <CiSearch size={20} color="#8B5E83" /> {/* Add search icon */}
            </div>
          </div>
        </div>

        {/* CategoryFilter */}
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
    </div>
  );
};

export default QnA;
