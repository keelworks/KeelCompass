// src/pages/Dashboard.tsx
import React from "react";
import PostsSection from "../components/dashboard/sections/PostsSection";
import MyInterestsSection from "../components/dashboard/sections/MyInterestsSection";
import DashboardWrapper from "../components/dashboard/DashboardWrapper";

const Dashboard: React.FC = () => {
  return (
    // <div className="grid grid-cols-4 gap-4">
    //   <div className="col-span-3">
    //     <PostsSection />
    //   </div>
    //   <div className="col-span-1">
    //     <InterestsSection />
    //   </div>
    // </div>

    <DashboardWrapper>
    
    {/* Left Column */}
    <div className="col-span-2 flex flex-col">
      <PostsSection />
      {/* Wrap CommunityUpdatesSection in a container */}
    
    </div>

    {/* Right Column */}
    <div className="col-span-1 flex flex-col">
      {/* Ask Question Button */}
      <div className="mb-8">
        <button className= "bg-custom-gradient text-white font-medium w-full py-3 rounded-lg hover:bg-teal-500/90 transition duration-200">
          Ask Question
        </button>
      </div>

      {/* Wrap MyInterestsSection in a container */}
      <div className="flex-grow">
        <MyInterestsSection/>
      </div>
    </div>
  
  </DashboardWrapper>
 
  );
};

export default Dashboard;
