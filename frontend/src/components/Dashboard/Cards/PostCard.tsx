import React, { useState } from "react";
import { Question } from "../../../utils/store";
import {
  FaRegThumbsUp,
  FaRegCommentDots,
  FaRegBookmark,
} from "react-icons/fa";
import { MdOutlineRateReview } from "react-icons/md";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import ExplodedPostCard from "./ExplodedPostCard";

interface PostCardProps {
  question: Question;
}

const PostCard: React.FC<PostCardProps> = ({ question }) => {
  const [elongated, setElongated] = useState(false);
  const [comments, setComments] = useState(8); // Still static
  const [showModal, setShowModal] = useState(false);
  const [postData, setPostData] = useState(question);

  const shouldTruncate = postData.description.length > 150;
  const displayText = elongated
    ? postData.description
    : postData.description.substring(0, 150) + "...";

  const handleEdit = (updatedTitle: string, updatedDescription: string) => {
    setPostData((prev) => ({
      ...prev,
      title: updatedTitle,
      description: updatedDescription,
    }));
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");

    if (!token) {
      alert("You must be logged in to like a question.");
      return;
    }

    try {
      const res = await fetch("http://localhost:8080/api/questions/action", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          questionID: postData.id,
          actionType: "like",
        }),
      });

      const data = await res.json();

      if (res.ok && data.message === "success") {
        setPostData((prev) => ({
          ...prev,
          likeCount: prev.likeCount + 1,
        }));
      } else if (data.message === "record existed") {
        alert("You've already liked this question.");
      } else {
        alert(data.message || "Failed to like the question");
      }
    } catch (error) {
      console.error("Error liking the question:", error);
      alert("An error occurred while liking the question.");
    }
  };

  return (
    <>
      <div
        className="p-4 rounded-lg bg-white w-full max-w-2xl shadow-b-md cursor-pointer hover:shadow-lg transition"
        onClick={() => setShowModal(true)}
      >
        {/* Top Section */}
        <div className="flex justify-between items-center mb-2">
          <div className="flex items-center">
            <img
              src="/default-avatar.png"
              alt={postData.user?.username || "User"}
              className="w-8 h-8 rounded-full mr-2"
            />
            <div className="flex items-center">
              <p className="text-sm font-medium text-gray-800">
                {postData.user?.username || "Anonymous"}
              </p>
              <span className="text-xs text-gray-500 ml-2">
                •{" "}
                {new Date(postData.created_at).toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>

          <div className="flex items-center text-gray-500 text-sm">
            <MdOutlineRateReview className="mr-1" />
            <span className="mr-4">In Review</span>
            <FaRegBookmark />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-[#004466] leading-relaxed mb-2">
          {postData.title}
        </h3>

        {/* Expandable Description */}
        <p className="text-base text-[#616161] leading-[1.5] inline">
          {displayText}
          {shouldTruncate && (
            <span
              className="text-[#007880] cursor-pointer hover:opacity-80 transition ml-1 inline-flex items-center"
              onClick={(e) => {
                e.stopPropagation();
                setElongated(!elongated);
              }}
            >
              {elongated ? "Read less" : "Read more"}{" "}
              <span className="ml-1">
                {elongated ? <IoIosArrowUp /> : <IoIosArrowDown />}
              </span>
            </span>
          )}
        </p>

        {/* Likes & Comments */}
        <div className="flex justify-end mt-3 text-gray-600 text-sm">
          <div className="flex items-center mr-4 cursor-pointer" onClick={handleLike}>
            <FaRegThumbsUp className="mr-1" />
            <span>{postData.likeCount}</span>
          </div>
          <div
            className="flex items-center cursor-pointer"
            onClick={(e) => e.stopPropagation()}
          >
            <FaRegCommentDots className="mr-1" />
            <span>{comments}</span>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <ExplodedPostCard
            question={postData}
            likes={postData.likeCount}
            comments={comments}
            setLikes={(newCount: number) =>
              setPostData((prev) => ({ ...prev, likeCount: newCount }))
            }
            handleClose={() => setShowModal(false)}
            handleEdit={handleEdit}
          />
        </div>
      )}
    </>
  );
};

export default PostCard;
