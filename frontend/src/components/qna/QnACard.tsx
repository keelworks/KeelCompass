import React, { useState } from "react";
import QnAUserName from "./QnAUserName";
import QnAStatus from "./QnAStatus";
import { GrNotes } from "react-icons/gr";
import ReplyButton from "./ReplyButton";
import ShowAllRepliesButton from "./ShowAllRepliesButton";
import LikeButton from "./LikeButton";
import DislikeButton from "./DislikeButton";
import Tag from "./Tag";
import BodyContent from "./BodyContent";
import { RxAvatar } from "react-icons/rx";
import VerticalIndicator from "./VerticalIndicator";

const QnACard: React.FC = () => {
  const [likeCount, setLikeCount] = useState(0);
  const [dislikeCount, setDislikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);

  const handleLikeToggle = () => {
    if (liked) {
      setLikeCount((prev) => prev - 1);
      setLiked(false);
    } else {
      setLikeCount((prev) => prev + 1);
      setLiked(true);

      if (disliked) {
        setDislikeCount((prev) => prev - 1);
        setDisliked(false);
      }
    }
  };

  const handleDislikeToggle = () => {
    if (disliked) {
      setDislikeCount((prev) => prev - 1);
      setDisliked(false);
    } else {
      setDislikeCount((prev) => prev + 1);
      setDisliked(true);

      if (liked) {
        setLikeCount((prev) => prev - 1);
        setLiked(false);
      }
    }
  };

  return (
    <div className="flex">
      {/* Left Vertical Indicator */}
      <VerticalIndicator />

      {/* Card Content */}
      <div
        className="w-[671px] h-[288px] bg-white shadow-md p-4"
        style={{
          borderTopRightRadius: "8px", // Top-right corner rounded
          borderBottomRightRadius: "8px", // Bottom-right corner rounded
        }}
      >
        {/* Main Flex Container */}
        <div className="flex flex-col justify-between h-full space-y-4">
          {/* Top Section */}
          <div className="flex justify-between items-center w-full h-[36px]">
            <QnAUserName
              icon={<div className="w-[8.43px] h-[10px]"><RxAvatar size={28} /></div>}
              name="Name"
              time="August 20, 2024 9:30 am"
            />
            <QnAStatus icon={<div className="w-[8.43px] h-[10px]"><GrNotes size={10} /></div>} statusText="In Review" />
          </div>

          {/* BodyContent Section */}
          <BodyContent
            title="Title"
            text="This is a sample body content. It can be very long, requiring truncation for better UI. Add your full content here, and it will be shortened dynamically based on the user's interaction. 'See more' allows users to expand the content."
          />

          {/* Tags Section */}
          <div
            className="flex items-center h-[32px]"
            style={{
              minWidth: "16px",
              width: "fit-content",
              maxWidth: "100%",
              overflowX: "auto",
              whiteSpace: "nowrap",
            }}
          >
            <p className="flex text-sm gap-[16px]">
              <Tag label={"Education"} />
              <Tag label={"Technology"} />
              <Tag label={"Science"} />
            </p>
          </div>

          {/* Combined Bottom Section */}
          <div className="flex justify-between items-center w-full h-[32px]">
            {/* Left Section: Reply and Show All Replies */}
            <div className="flex items-center gap-[21px]">
              <ReplyButton
                label="Reply"
                onClick={() => alert("Reply button clicked!")}
              />
              <ShowAllRepliesButton
                label="Show All Replies (21)"
                onClick={() => alert("Show All Replies button clicked!")}
              />
            </div>

            {/* Right Section: Like and Dislike Buttons */}
            <div className="flex items-center gap-2">
              <LikeButton
                count={likeCount}
                active={liked}
                onToggle={handleLikeToggle}
              />
              <DislikeButton
                count={dislikeCount}
                active={disliked}
                onToggle={handleDislikeToggle}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QnACard;
