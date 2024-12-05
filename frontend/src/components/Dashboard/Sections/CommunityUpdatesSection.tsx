import CommunityUpdateCard from "../Cards/CommunityUpdateCard";
import Backdrop from "../Modals/Backdrop";

const CommunityUpdatesSection = () => {
  const updates = [
    { title: "KCompass Rules of Conduct", content: "By following the code of conduct...", date: "Dec 1, 2024" },
    { title: "Community Guidelines", content: "Please reade before you participate...", date: "Dec 1, 2024"  },
  ];

  return (
    <div>
      <Backdrop className="mb-6" style={{width: "100%"}}>
      <h2 className="text-xl font-medium text-[#4A4A4A] uppercase tracking-wide mb-6">Community Updates</h2>
      <div className="grid grid-cols-2 gap-4">
        {updates.map((update, index) => (
          <CommunityUpdateCard key={index} {...update} />
        ))}
      </div>
      </Backdrop>
    </div>
  );
};



export default CommunityUpdatesSection;
