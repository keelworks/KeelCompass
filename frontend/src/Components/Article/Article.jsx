import React, { useState } from "react";
import NewArticle from "./NewArticle";

const Article = () => {
  const [articleForm, setArticleForm] = useState(false);
  const handleClick = () => {
    setArticleForm(true);
  };
  const handleClose = () => {
    setArticleForm(false);
  };
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {!articleForm && (
        <div>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-blue-500">Article</h2>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleClick}
            >
              Write article
            </button>
          </div>
          {/* menu */}
          <div className="flex mt-8 mb-8">
            <div className="w-1/4 bg-white p-4">
              <ul className="space-y-4 text-right">
                <li className="text-black font-semibold hover:text-blue-500 cursor-pointer transition duration-200">
                  Home
                </li>
                <li className="text-black font-semibold hover:text-blue-500 cursor-pointer transition duration-200">
                  Articles
                </li>
                <li className="text-black font-semibold hover:text-blue-500 cursor-pointer transition duration-200">
                  About
                </li>
                <li className="text-black font-semibold hover:text-blue-500 cursor-pointer transition duration-200">
                  Contact
                </li>
              </ul>
            </div>

            {/* Right Content */}
            <div className="w-2/3 bg-white rounded-lg p-6 ml-4">
              <h2 className="text-2xl font-bold text-black mb-2">
                Article Title
              </h2>
              <p className="text-sm text-gray-500 mb-4">by Author Name</p>
              <p className="text-gray-700 leading-relaxed">
                This is where the body of the article will be displayed. You can
                include multiple paragraphs, images, and other content elements
                here to convey your message effectively.
              </p>
            </div>
          </div>
        </div>
      )}
      {articleForm && <NewArticle onClose={handleClose} />}
    </div>
  );
};

export default Article;
