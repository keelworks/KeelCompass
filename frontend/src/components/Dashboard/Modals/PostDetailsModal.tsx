import React from "react";
import Backdrop from "./Backdrop";

interface PostDetailsModalProps {
  show: boolean;
  onClose: () => void;
  post: {
    title: string;
    content: string;
    author: string;
    date: string;
  };
}

const PostDetailsModal: React.FC<PostDetailsModalProps> = ({ show, onClose, post }) => {
  return (
    <Backdrop show={show} onClose={onClose}>
      <div>
        <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
        <p className="text-sm text-gray-500 mb-2">
          {post.author} • {post.date}
        </p>
        <p className="text-gray-700">{post.content}</p>
        <button
          onClick={onClose}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
        >
          Close
        </button>
      </div>
    </Backdrop>
  );
};

export default PostDetailsModal;
