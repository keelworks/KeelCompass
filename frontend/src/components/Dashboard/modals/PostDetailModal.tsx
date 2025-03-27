import React, { useState } from "react";
import { Question } from "../../../utils/store";
import { FaRegThumbsUp, FaRegCommentDots, FaFileAlt, FaPaperclip } from "react-icons/fa";

interface PostDetailModalProps {
  question: Question;
  onClose: () => void;
  likes: number;
  setLikes: React.Dispatch<React.SetStateAction<number>>;
}

const dummyComments = [
  { id: 1, user: "John Doe", comment: "Great post! Thanks for sharing." },
  { id: 2, user: "Jane Smith", comment: "I have the same question!" },
  { id: 3, user: "Alex Johnson", comment: "Can you provide more details?" },
];

const dummyAttachments = [
  { id: 1, name: "Document.pdf" },
  { id: 2, name: "Image.png" },
];

const PostDetailModal: React.FC<PostDetailModalProps> = ({
  question,
  onClose,
  likes,
  setLikes,
}) => {
  const [liked, setLiked] = useState(false);

  const handleLike = () => {
    if (liked) {
      setLikes((prev) => prev - 1);
      setLiked(false);
    } else {
      setLikes((prev) => prev + 1);
      setLiked(true);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
          onClick={onClose}
        >
          ✕
        </button>

        <div className="mb-4">
          <h3 className="text-lg font-semibold text-[#004466] mb-2">
            {question.title}
          </h3>

          <p className="text-base text-[#616161] leading-[1.5] mb-4">
            {question.description}
          </p>

          {/* Attachments */}
          <div className="mb-4">
            <p className="font-medium text-gray-700 mb-2 flex items-center">
              <FaPaperclip className="mr-2" /> Attachments
            </p>
            {dummyAttachments.length > 0 ? (
              <ul className="space-y-2">
                {dummyAttachments.map((attachment) => (
                  <li key={attachment.id} className="flex items-center text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                    <FaFileAlt className="mr-2" />
                    {attachment.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">No attachments.</p>
            )}
          </div>

          {/* Likes & Comments */}
          <div className="flex justify-end text-gray-600 text-sm mb-4">
            <div
              className={`flex items-center mr-4 cursor-pointer ${liked ? "text-blue-600" : ""}`}
              onClick={handleLike}
            >
              <FaRegThumbsUp className="mr-1" />
              <span>{likes} {likes === 1 ? "Like" : "Likes"}</span>
            </div>
            <div className="flex items-center">
              <FaRegCommentDots className="mr-1" />
              <span>{dummyComments.length} Comments</span>
            </div>
          </div>

          {/* Comments */}
          <div>
            <p className="font-medium text-gray-700 mb-2 flex items-center">
              <FaRegCommentDots className="mr-2" /> Comments
            </p>
            {dummyComments.map((c) => (
              <div key={c.id} className="mb-3 p-2 bg-gray-50 rounded">
                <p className="text-sm font-semibold text-gray-800">{c.user}</p>
                <p className="text-sm text-gray-700">{c.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailModal;
