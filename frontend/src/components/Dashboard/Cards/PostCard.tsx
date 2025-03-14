import React, { useState } from "react";
import { Question } from "../../../utils/store";
import { FaRegThumbsUp, FaRegCommentDots, FaRegBookmark } from "react-icons/fa";
import { MdOutlineRateReview } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

interface PostCardProps {
  question: Question;
}

const PostCard: React.FC<PostCardProps> = ({ question }) => {
  const [elongated, setElongated] = useState(false);
  const [likes, setLikes] = useState(3); // Placeholder for frontend only
  const [comments, setComments] = useState(8); // Placeholder for frontend only

  const shouldTruncate = question.description.length > 150;
  const displayText = elongated ? question.description : question.description.substring(0, 150) + "...";

  return (
    <div className="p-4 rounded-lg bg-white w-full max-w-2xl shadow-b-md">
      {/* Top Section: User Info + Review & Bookmark Icons */}
      <div className="flex justify-between items-center mb-2">
        {/* User Info */}
        <div className="flex items-center">
          <img
            src="/default-avatar.png" // Placeholder image
            alt="Dummy Name"
            className="w-8 h-8 rounded-full mr-2"
          />
          <div className="flex items-center">
            <p className="text-sm font-medium text-gray-800">Dummy Name</p>
            <span className="text-xs text-gray-500 ml-2">• November 8, 2024</span>
          </div>
        </div>

        {/* Review and Bookmark Icons */}
        <div className="flex items-center text-gray-500 text-sm">
          <MdOutlineRateReview className="mr-1" />
          <span className="mr-4">In Review</span>
          <FaRegBookmark className="cursor-pointer" />
        </div>
      </div>

      {/* Title */}
      <h3 className="text-lg font-semibold text-[#004466] leading-relaxed mb-2">
        {question.title}
      </h3>

      {/* Expandable Description */}
      <p className="text-base text-[#616161] leading-[1.5] inline">
        {displayText}
        {shouldTruncate && (
          <span
            className="text-[#007880] cursor-pointer hover:opacity-80 transition ml-1 inline-flex items-center"
            onClick={() => setElongated(!elongated)}
          >
            {elongated ? "Read less" : "Read more"}{" "}
            <span className="ml-1">{elongated ? <IoIosArrowUp /> : <IoIosArrowDown />}</span>
          </span>
        )}
      </p>

      {/* Like and Comment Section (Aligned Right) */}
      <div className="flex justify-end mt-3 text-gray-600 text-sm">
        <div className="flex items-center mr-4 cursor-pointer">
          <FaRegThumbsUp className="mr-1" />
          <span>{likes}</span>
        </div>
        <div className="flex items-center cursor-pointer">
          <FaRegCommentDots className="mr-1" />
          <span>{comments}</span>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
