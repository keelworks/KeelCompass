import React from "react";
import DashboardWrapper from "../components/Dashboard/DashboardWrapper";
import PostsSection from "../components/Dashboard/Sections/PostsSection";
import CommunityUpdatesSection from "../components/Dashboard/Sections/CommunityUpdatesSection";
import MyInterestsSection from "../components/Dashboard/Sections/MyInterestsSection";
import Navigation from "../components/Navigation/Navigation";

const Dashboard = () => {
  return (
    <DashboardWrapper>
      <div className="flex-none w-[240px] bg-gray-100">
        <Navigation />
      </div>
      {/* Left Column: Posts and Community Updates */}
      <div className="col-span-2 space-y-8">
        <PostsSection />
        <CommunityUpdatesSection />
      </div>

      {/* Right Column: My Interests */}
      <div className="col-span-1">
        <MyInterestsSection />
      </div>
    </DashboardWrapper>
  );
};

export default Dashboard;
