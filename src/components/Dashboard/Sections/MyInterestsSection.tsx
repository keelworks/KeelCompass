import InterestCard from "../Cards/InterestCard";
import Backdrop from "../Modals/Backdrop";

const MyInterestsSection = () => {
  const interests = [
    { id: 1, title: "Shared Workspace etiquettes", content: "what are unwritten rules",  date: "Dec 4, 2024" },
    { id: 2, title: "Community Guidlines", content: "Here's some more content...",  date: "Dec 1, 2024" },
    { id: 3, title: "General Guidlines", content: "General guideline for community...",  date: "Dec 2, 2024" }
  ];
 
  return (
    <div className="flex space-x-4">
      <Backdrop className="flex-1 h-full mb-6" style={{ minHeight: '100%' }}>
      <h2 className="text-xl font-bold mb-4">My Interests</h2>
      <div className="space-y-4">
        {interests.map((interest) => (
          <InterestCard key={interest.id} {...interest} />
        ))}
      </div>
      </Backdrop>
    </div>
  );
};
export default MyInterestsSection;
