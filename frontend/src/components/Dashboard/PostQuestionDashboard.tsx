import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const PostQuestionDashboard: React.FC = () => {
  const [questionTitle, setQuestionTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState("");

  const availableTags = ["Career Development", "Job Search", "Education"];
  const navigate = useNavigate();

  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to post a question.");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: questionTitle,
          description,
          tags: selectedTags,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to post question");
      }

      navigate("/");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  const handleCancel = () => {
    navigate("/");
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

          {error && (
            <p className="text-red-500 text-sm text-center -mt-2">{error}</p>
          )}

          <div className="flex flex-col gap-2">
            <label style={{ fontWeight: 600, fontSize: "16px" }}>
              Question Title<span style={{ color: "red" }}>*</span>
            </label>
            <input
              required
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
            <label style={{ fontWeight: 600, fontSize: "16px" }}>
              Description
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
            <label style={{ fontWeight: 600, fontSize: "16px" }}>
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
              onClick={handleCancel}
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

export default PostQuestionDashboard;
