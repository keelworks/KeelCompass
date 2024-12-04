import React from "react";
import Card from "./Card";


interface InterestCardProps {
  interest: string;
}

const InterestCard: React.FC<InterestCardProps> = ({ interest }) => {
  return (
    <Card>
      <h3 className="text-lg font-bold mb-4">{interest}</h3>
      
    </Card>
  );
};

export default InterestCard;
