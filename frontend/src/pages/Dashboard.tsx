import DashboardWrapper from "../components/Dashboard/DashboardWrapper";
import PostsSection from "../components/Dashboard/Sections/PostsSection";
import CommunityUpdatesSection from "../components/Dashboard/Sections/CommunityUpdatesSection";
import MyInterestsSection from "../components/Dashboard/Sections/MyInterestsSection";

const Dashboard = () => {
  return (
   
    <DashboardWrapper>
      {/* Left Column */}
      <div className="col-span-2 flex flex-col">
        <PostsSection />
        {/* Wrap CommunityUpdatesSection in a container */}
        <div className="mt-6 flex-grow">
          <CommunityUpdatesSection />
        </div>
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
