import React, { useState } from "react";

const PostQuestion: React.FC = () => {
  const [questionTitle, setQuestionTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const availableTags = ["Career Development", "Job Search", "Education"];

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      questionTitle,
      description,
      tags: selectedTags,
    };
    console.log("Form Submitted:", formData);
  };

  return (
    <div
      className="flex items-center justify-center h-screen"
      style={{
        borderRadius: "7px",
        padding: "28px 24px 24px 24px",
      }}
    >
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
        <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
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
              type="text"
              id="questionTitle"
              name="questionTitle"
              value={questionTitle}
              onChange={(e) => setQuestionTitle(e.target.value)}
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

          <div className="flex flex-col gap-2">
            <label
              style={{
                fontWeight: 600,
                fontSize: "16px",
                lineHeight: "19.2px",
              }}
            >
              Description<span style={{ color: "red" }}>*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              {availableTags.map((tag, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => handleTagClick(tag)}
                  className="flex items-center px-3 py-1 font-medium border border-gray-300 rounded-full"
                  style={{
                    height: "36px",
                    borderRadius: "18px",
                    color: selectedTags.includes(tag) ? "#FFFFFF" : "#063E53",
                    backgroundColor: selectedTags.includes(tag)
                      ? "#116989"
                      : "#064C651A",
                  }}
                >
                  {selectedTags.includes(tag) ? "✓ " : "+ "}
                  {tag}
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

          <div className="flex items-center gap-6">
            <button
              type="submit"
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
              type="button"
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
              type="button"
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
