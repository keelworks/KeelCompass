// src/pages/Dashboard.tsx
import React from "react";
import PostsSection from "../components/Dashboard/Sections/PostsSection";
import MyInterestsSection from "../components/Dashboard/Sections/MyInterestsSection";
import DashboardWrapper from "../components/Dashboard/DashboardWrapper";
import { useNavigate } from "react-router-dom";
import SearchBar from "../components/SearchBar";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const handleAskQuestionClick = () => {
    navigate("/post-question-dashboard"); // Navigate to PostQuestion page
  };
  return (
    <DashboardWrapper>
      {/* Left Column */}
      <div className="col-span-2 flex flex-col">
        {/* Add heading and search bar */}
        <div
          className="flex items-center justify-between mb-6"
          style={{
            width: "676px",
            height: "44px",
          }}
        >
          {/* Search Bar */}
          <div className="w-full">
            <SearchBar></SearchBar>
          </div>
        </div>
        <PostsSection />
        {/* Wrap CommunityUpdatesSection in a container */}
      </div>

      {/* Right Column */}
      <div className="col-span-1 flex flex-col">
        {/* Ask Question Button */}
        <div className="mb-8">
          <button
            onClick={handleAskQuestionClick}
            className="bg-custom-gradient text-white font-medium w-full py-3 rounded-lg hover:bg-teal-500/90 transition duration-200"
          >
            Ask Question
          </button>
        </div>

        {/* Wrap MyInterestsSection in a container */}
        <div className="flex-grow">
          <MyInterestsSection />
        </div>
      </div>
    </DashboardWrapper>
  );
};

export default Dashboard;
