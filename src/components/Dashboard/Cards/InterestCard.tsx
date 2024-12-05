import React from "react";
import Card1 from "./card1";
import Bookmark from "../Buttons/Bookmark";


interface InterestCardProps {
  
  title: string;
  content: string;
  date: string;
}

const InterestCard: React.FC<InterestCardProps> = ({title, content,  date  }) => {
  return (
    <Card1 className="relative cursor-pointer" date={date}>
      <Bookmark></Bookmark>
    
      <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-2">
          {content}
        </p>
      
    </Card1>
  );
};

export default InterestCard;
