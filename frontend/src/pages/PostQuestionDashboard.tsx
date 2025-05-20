import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Snackbar from "../components/ui/Snackbar";

import api from "../utils/api";


const PostQuestionDashboard: React.FC = () => {
  const [questionTitle, setQuestionTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [error, setError] = useState("");
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);
  const [titleCharError, setTitleCharError] = useState("");

const availableTags = ["Career Development", "Job Search", "Education", "KeelWorks", "KCompass Help"];
const navigate = useNavigate();

useEffect(() => {
  const draft = localStorage.getItem('questionDraft');
  if (draft) {
    const { questionTitle, description, tags } = JSON.parse(draft);
    setQuestionTitle(questionTitle);
    setDescription(description);
    setSelectedTags(tags);
  }
}, []);


  const handleTagClick = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();


    setError("");

  
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must be logged in to post a question.");
      return;
    }
  
    try {
      const count = 100;
      let offset = 0;
      let isDuplicate = false;
  
      while (offset !== -1 && !isDuplicate) {
        const res = await api.get(`/questions?count=${count}&offset=${offset}`);
        const data = res.data;
        const questions = data.questions || [];
  
        isDuplicate = questions.some(
          (q: { title: string }) =>
            q.title.trim().toLowerCase() === questionTitle.trim().toLowerCase()
        );
  
        offset = data.offset;
      }
  
      if (isDuplicate) {
        setError("A question with this title already exists.");
        setShowSnackbar(true);
        setTimeout(() => setShowSnackbar(false), 4000);
        return;
      }


      await api.post(
        "/questions",
        {
          title: questionTitle,
          description,
          tags: selectedTags,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

  
      navigate("/dashboard");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 4000);
    }
  };
  

  const handleClearDraft = () => {
    localStorage.removeItem('questionDraft');
    setQuestionTitle('');
    setDescription('');
    setSelectedTags([]);
    alert('Draft cleared!');
  };
  

  const handleCancel = () => {
    navigate("/dashboard");
  };

  const handleSaveDraft = () => {
    const draftData = {
      questionTitle,
      description,
      tags: selectedTags,
      savedAt: new Date().toISOString(),
    };
    localStorage.setItem('questionDraft', JSON.stringify(draftData));
    alert('Your draft has been saved!');
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
          {showSnackbar && error && (
  <Snackbar message={error} onClose={() => setShowSnackbar(false)} />
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
  onChange={(e) => {
    const value = e.target.value;
    if (value.length > 250) {
      setTitleCharError("Title cannot exceed 250 characters.");
    } else {
      setTitleCharError("");
    }
    setQuestionTitle(value);
  }}
  maxLength={256}
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
<div className="flex justify-between text-sm mt-1">
  <span style={{ color: "#5E7A84" }}>{questionTitle.length} / 250</span>
  {titleCharError && (
    <span className="text-red-500">{titleCharError}</span>
  )}
</div>

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
  <div className="flex items-center gap-2 flex-wrap">
    {(showAllTags ? availableTags : availableTags.slice(0, 3)).map((tag, index) => (
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
  {availableTags.length > 3 && (
    <button
  type="button"
  onClick={() => setShowAllTags(!showAllTags)}
  className="px-3 py-1 font-medium border border-gray-300 rounded-full transition hover:opacity-80"
  style={{
    height: "36px",
    borderRadius: "18px",
    color: "#116989",
    backgroundColor: "#064C651A",
  }}
>
  {showAllTags ? "− Show Less" : "+ More Tags"}
</button>

  )}
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
              onClick={handleSaveDraft}
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
              onClick={handleClearDraft}
              className="px-4 py-2 font-medium border rounded-md text-red-500 border-red-500"
              style={{
                width: "120px",
                height: "40px",
                color: "#116989",
                borderColor: "#11698980",
              }}
            >
              Clear Draft
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
