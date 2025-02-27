import React from "react";

const PostQuestion: React.FC = () => {
  return (
    <div
      className="flex items-center justify-center h-screen"
      style={{
        borderRadius: "7px",
        padding: "28px 24px 24px 24px",
      }}
    >
      {/* Container Frame */}
      <div
        className="flex flex-col items-center"
        style={{
          width: "676px",
          padding: "28px 24px 24px 24px",
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
          borderRadius: "7px",
          backgroundColor: "#FFFFFF",
        }}
      >
        <form className="flex flex-col gap-6 w-full">
          <h1
            style={{
              color: "#5E7A84",
              fontWeight: 600,
              fontSize: "20px",
              lineHeight: "24px",
              letterSpacing: "0%",
            }}
          >
            Post your question
          </h1>

          {/* Question Title */}
          <div className="flex flex-col gap-2">
            <label
              style={{
                fontWeight: 600,
                fontSize: "16px",
                lineHeight: "19.2px",
              }}
            >
              Question Title<span style={{ color: "red" }}>*</span>
            </label>
            <input
            required
              type="text"
              id="questionTitle"
              name="questionTitle"
              className="px-3 py-2 focus:outline-none focus:ring-1"
              style={{
                width: "100%",
                height: "36px",
                fontSize: "16px",
                borderRadius: "3px",
                border: "1px solid #D1DBDD",
                backgroundColor: "#FFFFFF",
                color: "#063E53",
              }}
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label
              style={{
                fontWeight: 600,
                fontSize: "16px",
                lineHeight: "19.2px",
              }}
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              className="px-3 py-2 focus:outline-none focus:ring-1"
              style={{
                width: "100%",
                height: "88px",
                fontSize: "16px",
                borderRadius: "3px",
                border: "1px solid #D1DBDD",
                backgroundColor: "#FFFFFF",
                color: "#063E53",
              }}
            />
          </div>

          {/* Categories & Tags */}
          <div className="flex flex-col gap-2">
            <label
              style={{
                fontWeight: 600,
                fontSize: "16px",
                lineHeight: "19.2px",
              }}
            >
              Categories & Tags
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {["Education", "Jobs", "Compass Help"].map((category, index) => (
                <button
                  key={index}
                  className="flex items-center px-3 py-1 font-medium border border-gray-300 rounded-full"
                  style={{
                    height: "36px",
                    borderRadius: "18px",
                    color: "#063E53",
                    backgroundColor: "#064C651A",
                  }}
                >
                  + {category}
                </button>
              ))}
              <button
                className="flex items-center px-3 py-1 font-medium border border-gray-300 rounded-full"
                style={{
                  height: "36px",
                  borderRadius: "18px",
                  color: "#063E53",
                  backgroundColor: "#064C651A",
                }}
              >
                +
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-6">
            <button
              className="px-4 py-2 font-medium rounded-md"
              style={{
                width: "94px",
                height: "40px",
                backgroundColor: "#116989",
                color: "#FFFFFF",
              }}
            >
              Post
            </button>
            <button
              className="px-4 py-2 font-medium border rounded-md"
              style={{
                width: "94px",
                height: "40px",
                color: "#116989",
                borderColor: "#11698980",
              }}
            >
              Save
            </button>
            <button
              className="px-4 py-2 font-medium hover:underline"
              style={{
                width: "94px",
                height: "40px",
                color: "#116989",
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
