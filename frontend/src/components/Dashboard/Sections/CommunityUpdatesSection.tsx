import React from "react";
import CommunityUpdateCard from "../Cards/CommunityUpdateCard";

const CommunityUpdatesSection = () => {
  const updates = [
    { title: "Update 1", content: "Here's a community update..." },
    { title: "Update 2", content: "Another update for the community..." },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Community Updates</h2>
      <div className="space-y-4">
        {updates.map((update, index) => (
          <CommunityUpdateCard key={index} {...update} />
        ))}
      </div>
    </div>
  );
};

export default CommunityUpdatesSection;
