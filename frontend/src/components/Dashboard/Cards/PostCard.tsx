// src/components/posts/PostCard.tsx
import React, { useState } from "react";
import { Question } from "../../../utils/store";
// import { Link } from "react-router-dom";

interface PostCardProps {
  question: Question;
}

const PostCard: React.FC<PostCardProps> = ({ question }) => {
  // Maybe truncate the description
  const truncatedDescription = question.description.length > 100
    ? question.description.substring(0, 100) + "..."
    : question.description;

  const [elongated, setElongated] = useState(false);

  

  return (
    <div className={`border p-4 rounded`}>
      <h3 className="text-lg font-normal text-[#004466] leading-relaxed">{question.title}</h3>
      <div className= {`${!elongated && "truncate"}`}>
      <p
      className={`
        text-base 
        text-[#616161] 
        leading-[1.5] 
        mb-4 
        ${!elongated && "truncate"}
      `}
    >{elongated ? question.description : truncatedDescription}</p>
      </div>
      {/* <p className="text-sm text-gray-500">by {question.user.username} on {question.created_at}</p> */}
      {/* "Read More" could link to a detail page if you have routing */}
      
      {question.description.length > 100 && (
        <div className="bg-custom-gradient bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition" onClick={() => setElongated(!elongated)}>
          {elongated ? (
          // When showing full text
          <span>Read less   <span
          className="
            inline-block
            w-0 
            h-0 
            ml-1
            border-l-[5px] 
            border-r-[5px] 
            border-b-[6px]
            border-l-transparent 
            border-r-transparent 
            border-b-teal-500
          "
        /></span>
        ) : (
          // When truncated, show "Read more" + arrow
          <span className="flex items-center">
            Read more
            <span
              className="
                inline-block 
                w-0 
                h-0 
                ml-1
                border-l-[5px] 
                border-r-[5px] 
                border-t-[6px]
                border-l-transparent 
                border-r-transparent 
                border-t-teal-500
              "
            />
          </span>
        )}
        </div>
      )}
    </div>
  );
};

export default PostCard;
