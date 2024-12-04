import React from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation/Navigation";
import QnACard from "../components/qna/QnACard";
import CategoryFilter from "../components/qna/CategoryFilter";
import { CiSearch } from "react-icons/ci";

const QnA = () => {
  const navigate = useNavigate();

  const categories = ["All", "My Posts", "Education", "Jobs", "Bookmarked"];
  const subcategories = ["Posted", "Pending", "Drafts"];

  const handleFilterChange = (mainCategory: string, subCategory: string) => {
    console.log("Selected Category:", mainCategory);
    console.log("Selected Subcategory:", subCategory);
  };

  const handleAskQuestionClick = () => {
    navigate("/post-question"); // Navigate to PostQuestion page
  };

  return (
    <div className="flex h-screen">
      {/* Navigation on the left */}
      <div className="flex-none w-[240px] bg-gray-100">
        <Navigation />
      </div>

      {/* Rest of the content */}
      <div className="flex-1 flex flex-col px-6 pt-6 bg-[#F0F0F0]">
        {/* Add heading and search bar */}
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
            className="flex items-center rounded-[8px] shadow-sm"
            style={{
              width: "236px",
              height: "44px",
              backgroundColor: "#FFFFFF",
              padding: "5px 10px",
            }}
          >
            <input
              type="text"
              placeholder="Search"
              className="w-full h-full bg-transparent text-black text-sm font-lato focus:outline-none"
              style={{
                marginRight: "10px",
              }}
            />
            <div
              className="flex items-center justify-center"
              style={{
                width: "32px",
                height: "32px",
              }}
            >
              <CiSearch size={20} color="#8B5E83" />
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

        {/* QnACard */}
        <div className="mt-4 flex-grow">
          <QnACard />
        </div>

        {/* Ask Question Button */}
        <div className="flex justify-center mt-8">
          <button
            onClick={handleAskQuestionClick}
            className="rounded-md text-white font-lato text-sm"
            style={{
              width: "322px",
              height: "44px",
              backgroundColor: "#58B6BE",
            }}
          >
            Ask Question
          </button>
        </div>
      </div>
    </div>
  );
};

export default QnA;
