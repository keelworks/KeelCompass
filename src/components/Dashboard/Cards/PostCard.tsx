// import React, { useState } from "react";
import Card from "./Card";
import LikeButton from "../Buttons/LikeButton";
import CommentButton from "../Buttons/CommentButton";
import Bookmark from "../Buttons/Bookmark";


interface PostProps {
  title: string;
  content: string;
  author: string;
  date: string;
}

const PostCard: React.FC<PostProps> = ({ title, content, author, date }) => {
  // const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Card className="relative cursor-pointer">
        <Bookmark></Bookmark>
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-2">
          {author} 
        </p>
        <p className="text-sm text-gray-500 mb-2">
          {content}
        </p>

        <div className="flex justify-between items-center mt-4">
          {/* Date on the left */}
          <p className="text-sm text-gray-500">{date}</p>

          {/* Like and Comment buttons on the right */}
          <div className="flex space-x-4">
            <LikeButton />
            <CommentButton />
          </div>
        </div>
      </Card>

    
    </>
  );
};

export default PostCard;
