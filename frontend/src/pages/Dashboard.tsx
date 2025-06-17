import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import PostsSection from "../components/dashboard/sections/PostsSection";
import MyInterestsSection from "../components/dashboard/sections/MyInterestsSection";
import MainLayout from "../components/wrappers/MainLayout";
import SearchBar from "../components/searchBar/SearchBar";

const Dashboard = () => {
  const navigate = useNavigate();
  const [notificationCount] = useState(3);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const handleAskQuestionClick = () => {
    navigate("/dashboard/post-question");
  };

  return (
    <MainLayout>
      {/* Left Column */}
      <div className="col-span-2 flex flex-col">
        <div
          className="flex items-center justify-between mb-6"
          style={{ width: "790px", height: "70px" }}
        >
          <div className="w-full">
            <SearchBar />
          </div>
        </div>
        <PostsSection />
      </div>

      {/* Right Column */}
      <div className="col-span-1 flex flex-col pt-1 relative">
        {/* Top Right Buttons - Fixed Positioning */}
        <div className="absolute top-0 right-0 flex gap-3 p-4">
          {/* Help Button */}
          <button className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition-transform duration-300 hover:scale-110">
            <svg 
              viewBox="0 0 24 24" 
              className="w-5 h-5 text-gray-600"
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
              />
            </svg>
          </button>

          {/* Notification Button with Badge */}
          <button className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition-transform duration-300 hover:scale-110 relative">
            {notificationCount > 0 && (
              <div className="absolute -top-1 -right-1 bg-yellow-400 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                {notificationCount}
              </div>
            )}
            <svg 
              viewBox="0 0 24 24" 
              className="w-5 h-5 text-gray-600"
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"
              />
            </svg>
          </button>

          {/* Profile Button with Dropdown */}
          <div className="relative">
            <button 
              className="bg-gray-100 rounded-full w-10 h-10 flex items-center justify-center hover:bg-gray-200 transition-transform duration-300 hover:scale-110"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <svg 
                viewBox="0 0 24 24" 
                className="w-5 h-5 text-gray-600"
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => setShowProfileDropdown(false)}
                >
                  Profile
                </button>
                <button
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  onClick={() => setShowProfileDropdown(false)}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Content Below Icons */}
        <div className="mt-16"> {/* Added margin to push content below icons */}
          <div className="mb-6 pt-10">
            <button
              onClick={handleAskQuestionClick}
              className="bg-custom-gradient text-white font-medium w-full py-3 rounded-lg hover:bg-teal-500/90 transition duration-200 flex items-center gap-2 justify-center"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 4v16m8-8H4" 
                />
              </svg>
              Ask Question
            </button>
          </div>
          
          <div className="flex-grow">
            <MyInterestsSection />
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;