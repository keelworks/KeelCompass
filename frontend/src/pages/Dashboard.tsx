import { useNavigate } from "react-router-dom";
import PostsSection from "../components/dashboard/sections/PostsSection";
import MyInterestsSection from "../components/dashboard/sections/MyInterestsSection";
import MainLayout from "../components/wrappers/MainLayout";
import SearchBar from "../components/searchBar/SearchBar";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleAskQuestionClick = () => {
    navigate("/dashboard/post-question");
  };

  return (
    <MainLayout>
      {/* Left Column */}
      <div className="col-span-2 flex flex-col">
        <div
          className="flex items-center justify-between mb-6"
          style={{ width: "676px", height: "44px" }}
        >
          <div className="w-full">
            <SearchBar />
          </div>
        </div>
        <PostsSection />
      </div>

      {/* Right Column */}
      <div className="col-span-1 flex flex-col">
        <div className="mb-8">
          <button
            onClick={handleAskQuestionClick}
            className="bg-custom-gradient text-white font-medium w-full py-3 rounded-lg hover:bg-teal-500/90 transition duration-200"
          >
            Ask Question
          </button>
        </div>
        <div className="flex-grow">
          <MyInterestsSection />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
