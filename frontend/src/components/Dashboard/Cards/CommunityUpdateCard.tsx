import React from "react";
import Card from "./Card";


interface CommunityUpdateProps {
  title: string;
  content: string;
}

const CommunityUpdateCard: React.FC<CommunityUpdateProps> = ({ title, content }) => {
  return (
    <Card>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-700 mb-4">{content}</p>
      <div className="mt-4">
      
      </div>
    </Card>
  );
};


export default CommunityUpdateCard;
