import { useState } from "react"; //  Import useState
import InterestCard from "../cards/InterestCard"
import Backdrop from "../modals/BackkDrop";

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
          <div className="mt-4 flex justify-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-[#007880] hover:text-[#005a61] font-medium text-sm transition-colors duration-200 underline"
            >
              {showAll ? 'Show Less' : 'View all My Interests'}
            </button>
          </div>
        )}
      </Backdrop>
    </div>
  );
};

export default MyInterestsSection;