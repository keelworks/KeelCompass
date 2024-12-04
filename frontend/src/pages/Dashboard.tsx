import React from "react";
import DashboardWrapper from "../components/Dashboard/DashboardWrapper";
import PostsSection from "../components/Dashboard/Sections/PostsSection";
import CommunityUpdatesSection from "../components/Dashboard/Sections/CommunityUpdatesSection";
import MyInterestsSection from "../components/Dashboard/Sections/MyInterestsSection";

const Dashboard = () => {
  return (
    <DashboardWrapper>
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
