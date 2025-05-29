import { useNavigate } from "react-router-dom";
import PostsSection from "../components/dashboard/sections/PostsSection";
import MyInterestsSection from "../components/dashboard/sections/MyInterestsSection";
import MainLayout from "../components/wrappers/MainLayout";
import SearchBar from "../components/searchBar/SearchBar";
import { useState, useEffect } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
   const [interests, setInterests] = useState([]); // State for managing MyInterests
  const [loading, setLoading] = useState(true); 

  // Move fetchUserInterests to Dashboard
  const fetchUserInterests = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/interests`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await res.json();
      if (res.ok && data.message === "success" && data.interests) {
        setInterests(data.interests); // Set interests data
      } else {
        setInterests([]);
      }
    } catch (err) {
      console.error("Error fetching interests:", err);
      setInterests([]);
    } finally {
      setLoading(false);
    }
  };
  //console.log("type is ",fetchUserInterests);
  useEffect(() => {
    fetchUserInterests();
  }, []);

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
        <PostsSection refreshInterests={fetchUserInterests}/>
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
          <MyInterestsSection interests={interests} loading={loading} />
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
