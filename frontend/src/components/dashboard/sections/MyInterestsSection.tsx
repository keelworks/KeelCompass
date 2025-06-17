import { MdBookmarks } from "react-icons/md";
import InterestCard from "../cards/InterestCard";
import Backdrop from "../modals/BackkDrop";


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
      </Backdrop>
    </div>
  );
};

export default MyInterestsSection;