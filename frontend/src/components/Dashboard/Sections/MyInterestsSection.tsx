import InterestCard from "../Cards/InterestCard";
import Backdrop from "../Modals/Backdrop";

const MyInterestsSection = () => {
  const interests = [
    { id: 1, title: "Shared Workspace etiquettes", content: "what are unwritten rules",  date: "Dec 4, 2024" },
    { id: 2, title: "Community Guidlines", content: "Here's some more content...",  date: "Dec 1, 2024" },
    { id: 3, title: "General Guidlines", content: "General guideline for community...",  date: "Dec 2, 2024" }
  ];
 
  return (
    <div className="flex flex-col h-full">
      <Backdrop className="flex flex-col h-full p-6 bg-white shadow-md rounded-lg" style={{ height: '680px' }}>
      <h2 className="text-xl font-medium text-[#4A4A4A] uppercase tracking-wide mb-6">My Interests</h2>
      <div className="flex flex-col space-y-4 flex-grow">
        {interests.map((interest) => (
          <InterestCard key={interest.id} {...interest} />
        ))}
      </div>
      </Backdrop>
    </div>
  );



};
export default MyInterestsSection;
