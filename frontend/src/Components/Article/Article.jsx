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
                <li className="text-grey-700 hover:text-black cursor-pointer transition duration-200 text-sm underline">
                  Articles in this category
                </li>
                <li className="text-grey-700 hover:text-black cursor-pointer transition duration-200 text-sm underline">
                  Home
                </li>
                <li className="text-grey-700 hover:text-black cursor-pointer transition duration-200 text-sm underline">
                  Articles
                </li>
                <li className="text-grey-700 hover:text-black cursor-pointer transition duration-200 text-sm underline">
                  About
                </li>
                <li className="text-grey-700 hover:text-black cursor-pointer transition duration-200 text-sm underline">
                  Contact
                </li>
              </ul>
            </div>

            {/* Right Content */}
            <div className="w-2/3 bg-white rounded-lg p-6 ml-4">
              <h2 className="text-4xl font-bold text-black mb-5">
                Article Title
              </h2>
              <p className="text-sm text-gray-500 mb-4">by Author Name</p>
              <p className="text-gray-700 leading-relaxed">
                This is where the body of the article will be displayed. You can
                include multiple paragraphs, images, and other content elements
                here to convey your message effectively.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                
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
