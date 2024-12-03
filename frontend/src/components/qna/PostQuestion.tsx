import React from "react";

const PostQuestion: React.FC = () => {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: "676px",
        height: "588px",
        border: "1px solid #e5e7eb", // Optional border for outer frame
        padding: "16px",
      }}
    >
      {/* Inner Frame */}
      <div
        className="flex flex-col items-center"
        style={{
          width: "628px",
          height: "530px",
          border: "1px solid #e5e7eb", // Optional border for inner frame
          padding: "16px",
        }}
      >
        {/* Form Container */}
        <form
          className="flex flex-col"
          style={{
            width: "588px",
            height: "464px",
          }}
        >
          {/* Question Title */}
          <div
            className="mb-6"
            style={{
              width: "582px",
              height: "63px",
            }}
          >
            <label
              htmlFor="questionTitle"
              className="flex items-center text-gray-700 font-medium mb-2"
              style={{
                fontSize: "16px",
                height: "19px",
              }}
            >
              Question Title{" "}
              <span
                className="text-red-500 ml-1"
                style={{
                  fontSize: "16px",
                }}
              >
                *
              </span>
            </label>
            <input
              type="text"
              id="questionTitle"
              name="questionTitle"
              className="block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              style={{
                width: "582px",
                height: "36px",
                fontSize: "16px",
              }}
            />
          </div>

          {/* Description */}
          <div
            className="mb-6"
            style={{
              width: "582px",
              height: "115px",
            }}
          >
            <label
              htmlFor="description"
              className="flex items-center text-gray-700 font-medium mb-2"
              style={{
                fontSize: "16px",
                height: "19px",
              }}
            >
              Description{" "}
              <span
                className="text-red-500 ml-1"
                style={{
                  fontSize: "16px",
                }}
              >
                *
              </span>
            </label>
            <textarea
              id="description"
              name="description"
              className="block w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
              style={{
                width: "582px",
                height: "88px",
                fontSize: "16px",
              }}
            />
          </div>

          {/* Categories & Tags */}
          <div
            className="mb-6"
            style={{
              width: "582px",
              height: "63px",
            }}
          >
            <label
              className="text-gray-700 font-medium mb-2"
              style={{
                fontSize: "16px",
                height: "19px",
              }}
            >
              Categories & Tags
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {["Education", "Jobs", "Compass Help"].map((category, index) => (
                <button
                  key={index}
                  className="flex items-center px-3 py-1 text-gray-700 font-medium border border-gray-300 rounded-full hover:bg-gray-100"
                  style={{
                    height: "36px",
                  }}
                >
                  + {category}
                </button>
              ))}
              {/* Add Tag Button */}
              <button
                className="flex items-center px-3 py-1 text-gray-700 font-medium border border-gray-300 rounded-full hover:bg-gray-100"
                style={{
                  height: "36px",
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Buttons */}
          <div
            className="flex justify-start items-center gap-4"
            style={{
              width: "336px",
              height: "44px",
            }}
          >
            {/* Post Button */}
            <button
              type="submit"
              className="px-4 py-2 text-white font-medium rounded-md"
              style={{
                width: "94px",
                height: "40px",
                backgroundColor: "#000000", // Explicitly black
              }}
            >
              Post
            </button>

            {/* Save Button */}
            <button
              type="button"
              className="px-4 py-2 text-blue-700 font-medium border border-blue-700 hover:bg-blue-50 rounded-md"
              style={{
                width: "94px",
                height: "40px",
              }}
            >
              Save
            </button>

            {/* Cancel Button */}
            <button
              type="button"
              className="px-4 py-2 text-blue-700 font-medium hover:underline"
              style={{
                width: "94px",
                height: "40px",
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostQuestion;
