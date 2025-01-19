import React from "react";
import InterestCard from "../Cards/InterestCard";

const MyInterestsSection = () => {
  const interests = ["Interest 1", "Interest 2", "Interest 3"];

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">My Interests</h2>
      <div className="space-y-4">
        {interests.map((interest, index) => (
          <InterestCard key={index} interest={interest} />
        ))}
      </div>
    </div>
  );
};
export default MyInterestsSection;
