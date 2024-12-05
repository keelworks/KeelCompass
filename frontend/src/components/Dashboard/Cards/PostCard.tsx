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
      <Card className="relative cursor-pointer p-4">
        <div className="flex items-start space-x-3 mb-3">
          <img
            src="/images/profile.svg"
            alt="Profile"
            className="w-8 h-8 rounded-full"
          />
          <div className="flex-1">
            {/* Title */}
            <h3 className="text-lg font-normal text-[#004466] leading-relaxed">
              {title}
            </h3>

            {/* Author and Content */}
            <p className="text-base text-[#616161] leading-[1.5] mb-1">
              <span className="text-[15px] font-medium text-[#4a4a4a]">
                {author}:
              </span>{" "}
              {content}
            </p>

            {/* Date and Buttons */}
            <div className="flex justify-between items-center mt-2">
              {/* Date */}
              <p className="text-sm text-[#999999] italic">{date}</p>

              {/* Like, Comment, and Bookmark Buttons */}
              <div className="flex items-center space-x-4">
                <LikeButton />
                <CommentButton />
                <Bookmark src="/images/add-bookmark.svg" />
              </div>
            </div>
          </div>
        </div>
      </Card>

    
    </>
  );
};

export default PostCard;
