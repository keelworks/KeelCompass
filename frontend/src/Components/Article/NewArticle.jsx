import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import the necessary CSS

const NewArticle = ({ onClose }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [showForm, setShowForm] = useState(true);

  const handleSubmit = (event) => {
    event.preventDefault();
    // Add logic to save the article to your database or API here
    console.log("Article submitted:", { title, content, author, category });
  };

  const handleClose = () => {
    onClose();
  };

  const handleFileChange = (event) => {
    // Handle file selection
  };

  return (
    showForm && (
      <div className="flex justify-center">
        <div className="w-full max-w-2xl mx-auto my-8 p-4 md:p-6 bg-white rounded shadow-lg">
          <div className="flex justify-between mb-4">
            <h1 className="text-lg font-bold">Write an article</h1>
            <button
              className="text-gray-500 hover:text-gray-700 transition duration-300"
              onClick={handleClose}
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4 flex flex-col space-y-2">
              <label
                className="block text-gray-700 text-sm font-bold"
                htmlFor="title"
              >
                What topic are you writing about?
              </label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              >
                <option value="">Select</option>
                <option value="topic1">Topic 1</option>
                <option value="topic2">Topic 2</option>
                <option value="topic3">Topic 3</option>
              </select>
            </div>
            <div className="mb-4 flex flex-col space-y-2">
              <label
                className="block text-gray-700 text-sm font-bold flex items-center"
                htmlFor="content"
              >
                Title
                <span className="text-red-500 ml-1">*</span>
                <span className="text-red-500 ml-1 italic text-xs">Required</span>
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                required
                placeholder="Write a descriptive title"
              />
            </div>

            <div className="mb-4 flex flex-col space-y-2">
              <label
                className="block text-gray-700 text-sm font-bold"
                htmlFor="author"
              >
                Body Text
              </label>
              <div className="h-64">
                <ReactQuill
                  className="h-52"
                  id="author"
                  value={author}
                  onChange={setAuthor}
                  formats={[
                    "header",
                    "bold",
                    "italic",
                    "underline",
                    "strike",
                    "blockquote",
                    "list",
                    "bullet",
                    "indent",
                    "link",
                    "image",
                  ]}
                  modules={{
                    toolbar: [["bold", "italic", "underline"]],
                  }}
                />
              </div>
            </div>
            <div className="mb-4 flex flex-col space-y-2">
              <label
                className="block text-gray-700 text-sm font-bold"
                htmlFor="document"
              >
                Upload Document
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="document"
                type="file"
                onChange={handleFileChange}
              />
            </div>
            <div className="flex justify-start gap-8">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Add Article
              </button>
              <button
                className="bg-gray-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                onClick={handleClose}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default NewArticle;
