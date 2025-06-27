<<<<<<< HEAD
import { MdBookmarks } from "react-icons/md";
import InterestCard from "../cards/InterestCard";
=======
import { useState } from "react"; //  Import useState
import InterestCard from "../cards/InterestCard"
>>>>>>> origin/main
import Backdrop from "../modals/BackkDrop";
import { ChevronDown, ChevronUp } from 'lucide-react';

interface Question {
  id: number;
  title: string;
  description: string;
}

interface Interest {
  id: number;
  user_id: number;
  question_id: number;
  comment_id: number | null;
  created_at: string;
  question?: Question;
}

interface MyInterestsSectionProps {
  interests: Interest[];
  loading: boolean;
}

const MyInterestsSection = ({ interests, loading }: MyInterestsSectionProps) => {
  // NEW: State to toggle between limited and full view
  const [showAll, setShowAll] = useState(false);

  if (loading) {
    return (
      <div className="flex flex-col h-full">
        <Backdrop className="flex flex-col h-full p-6 bg-white shadow-md rounded-lg" style={{ height: '680px' }}>
          <h2 className="text-xl font-medium text-[#4A4A4A] uppercase tracking-wide mb-6">My Interests</h2>
          <div className="flex justify-center items-center flex-grow">
            <p>Loading...</p>
          </div>
        </Backdrop>
      </div>
    );
  }

  // Add null/undefined check for interests
  const safeInterests = interests || [];
  
  // NEW: Determine which interests to show
  const interestsToShow = showAll ? safeInterests : safeInterests.slice(0, 4);
  const hasMoreInterests = safeInterests.length > 4; // 🔥 NEW: Check if there are more than 4

<<<<<<< HEAD

const MyInterestsSection = () => {
  const interests = [
    { id: 1, title: "Shared Workspace etiquettes", content: "what are unwritten rules", date: "Feb 4, 2025" },
    { id: 2, title: "Community Guidelines", content: "Here's some more content...", date: "Feb 1, 2025" },
    { id: 3, title: "General Guidelines", content: "General guideline for community...", date: "Feb 2, 2025" }
  ];

  return (
    <div className="flex flex-col h-full">
      <Backdrop className="flex flex-col h-full p-6 bg-white shadow-md rounded-lg" style={{ height: '590px' }}>
        {/* Header with title and bookmark */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-[#4A4A4A] uppercase tracking-wide">My Interests</h2>
          <MdBookmarks className="text-[#00A2A3] hover:text-[#008A8B] cursor-pointer w-5 h-5" />
        </div>

        <div className="flex flex-col space-y-4 flex-grow overflow-y-auto">
          {interests.map((interest) => (
            <InterestCard key={interest.id} {...interest} />
          ))}
        </div>

        {/* View all interests link - Bottom left */}
        <div className="mt-auto">
          <a 
            href="#" 
            className="flex items-center text-[#00A2A3] hover:text-[#008A8B] lowercase text-sm font-medium transition-colors pt-4"
          >
            View all interests
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-4 w-4 ml-2"
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M14 5l7 7m0 0l-7 7m7-7H3" 
              />
            </svg>
          </a>
        </div>
=======
  return (
    <div className="flex flex-col h-full">
      <Backdrop className="flex flex-col h-full p-6 bg-white shadow-md rounded-lg" style={{ height: '680px' }}>
        <h2 className="text-xl font-medium text-[#4A4A4A] uppercase tracking-wide mb-6">My Interests</h2>
        
        {/* UPDATED: Container with conditional scrolling */}
        <div className={`flex flex-col space-y-4 flex-grow ${showAll ? 'overflow-y-auto pr-2' : ''}`}>
          {safeInterests.length > 0 ? (
            interestsToShow.map((interest) => (
              <InterestCard 
                key={interest.id} 
                title={interest.question?.title || ""}
                content={interest.question?.description || ""}
                date={new Date(interest.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              />
            ))
          ) : (
            <div className="flex justify-center items-center flex-grow">
              <p className="text-gray-500">No interests found</p>
            </div>
          )}
        </div>

        {/* NEW: View All / Show Less Button */}
        {hasMoreInterests && (
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="group flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#007880] to-[#00a0aa] text-white font-medium text-sm rounded-lg shadow-md hover:shadow-lg hover:from-[#005a61] hover:to-[#007880] transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#007880] focus:ring-opacity-50"
            >
              <span className="transition-all duration-200">
                {showAll ? 'Show Less' : 'View All My Interests'}
              </span>
              <div className="transition-transform duration-200 group-hover:scale-110">
                {showAll ? (
                  <ChevronUp size={16} className="transition-transform duration-200" />
                ) : (
                  <ChevronDown size={16} className="transition-transform duration-200" />
                )}
              </div>
            </button>
          </div>
        )}
>>>>>>> origin/main
      </Backdrop>
    </div>
  );
};

export default MyInterestsSection;