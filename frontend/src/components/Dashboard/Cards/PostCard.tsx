import React, { useState } from "react";
import Card from "./Card";
import LikeButton from "../Buttons/LikeButton";
import CommentButton from "../Buttons/CommentButton";
import PostDetailsModal from "../Modals/PostDetailsModal";

interface PostProps {
  title: string;
  content: string;
  author: string;
  date: string;
}

const PostCard: React.FC<PostProps> = ({ title, content, author, date }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <Card onClick={() => setShowModal(true)} className="cursor-pointer">
        <h3 className="text-lg font-bold mb-2">{title}</h3>
        <p className="text-sm text-gray-500 mb-2">
          {author} • {date}
        </p>
        <p className="text-gray-700 mb-4">{content}</p>
        <div className="flex space-x-4">
          <LikeButton />
          <CommentButton />
         
        </div>
      </Card>

      {/* Post Details Modal */}
      <PostDetailsModal
        show={showModal}
        onClose={() => setShowModal(false)}
        post={{ title, content, author, date }}
      />
    </>
  );
};

export default PostCard;
