import MainLayout from "../components/wrappers/MainLayout";
import SearchBar from "../components/searchBar/SearchBar";
import PostsSection from "../components/dashboard/PostsSection";
import MyInterestsSection from "../components/dashboard/MyInterestsSection";
import { useNavigate } from "react-router-dom";

import { useEffect } from "react";
import { getAllCategories } from "../utils/store";

const Dashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAndStoreCategories = async () => {
      const cached = localStorage.getItem("categories");
      if (!cached) {
        try {
          const categories = await getAllCategories();
          localStorage.setItem("categories", JSON.stringify(categories));
        } catch (err) {
          console.error("Failed to fetch categories", err);
        }
      }
    };
    fetchAndStoreCategories();
  }, []);

  return (
    <MainLayout>
      <div className="col-span-2 flex flex-col">
        <div className="flex items-center justify-between mb-6" style={{ width: "676px", height: "44px" }}>
          <div className="w-full">
            <SearchBar />
          </div>
        </div>
        <PostsSection />
      </div>

      <div className="col-span-1 flex flex-col">
        <div className="mb-8">
          <button className="bg-custom-gradient text-white font-medium w-full py-3 rounded-lg hover:bg-teal-500/90 transition duration-200" onClick={() => navigate('/dashboard/post-question')}>
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
