import React from "react";
import Card1 from "./card1";
import Bookmark from "../Buttons/Bookmark";


interface CommunityUpdateProps {
  title: string;
  content: string;
  date: string
}

const CommunityUpdateCard: React.FC<CommunityUpdateProps> = ({ title, content, date }) => {
  return (
    <Card1 className="relative cursor-pointer" date={date}>
      <Bookmark></Bookmark>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-700 mb-4">{content}</p>
      <div className="mt-4">
      
      </div>
    </Card1>
  );
};


export default CommunityUpdateCard;
