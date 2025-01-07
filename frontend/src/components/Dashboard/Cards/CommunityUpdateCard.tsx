import React from "react";
import InfoCard from "./InfoCard";
import Bookmark from "../Buttons/Bookmark";


interface CommunityUpdateProps {
  title: string;
  content: string;
  date: string
}

const CommunityUpdateCard: React.FC<CommunityUpdateProps> = ({ title, content, date }) => {
  return (
    <InfoCard className="relative cursor-pointer" date={date}>
      <Bookmark  src="/images/bookmark.svg"></Bookmark>
      <h3 className="text-lg font-normal text-[#004466] leading-relaxed">{title}</h3>
      <p className="text-base text-[#616161] leading-[1.5] mb-4">{content}</p>
      <div className="mt-4">
      
      </div>
    </InfoCard>
  );
};


export default CommunityUpdateCard;
