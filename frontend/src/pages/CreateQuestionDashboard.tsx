import EmojiPicker from "emoji-picker-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Category } from "../utils/types";

import { useEffect } from "react";

function CreateQuestionDashboard() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const catStr = localStorage.getItem("categories");
    if (catStr) {
      try {
        setCategories(JSON.parse(catStr));
      } catch {
        setCategories([]);
      }
    }
  }, []);

  const handleSubmitQuestion = async () => {
    
  };

  return (
    <div className="flex items-center justify-center h-screen" style={{ borderRadius: "7px", padding: "28px 24px 24px 24px" }}>
      <div className="flex flex-col items-center" style={{
        width: "676px",
        padding: "28px 24px 24px 24px",
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
        borderRadius: "7px",
        backgroundColor: "#FFFFFF",
      }}>
         <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmitQuestion}>
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
              <label style={{ fontWeight: 600, fontSize: "16px" }}>
                Question Title<span style={{ color: "red" }}>*</span>
              </label>
              <input
                required
                type="text"
                id="questionTitle"
                name="questionTitle"
                value={title}
                onChange={e => setTitle(e.target.value)}
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
                <span style={{ color: "#5E7A84" }}>{title.length} / 250</span>
              </div>

            </div>


            <div className="flex flex-col gap-2">
              <label style={{ fontWeight: 600, fontSize: "16px" }}>
                Description
              </label>
              <div className="relative">
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
                {/* Icon Toolbar */}
                <div className="absolute bottom-2 left-1 flex items-left">

                  {/* Emoji Button */}
                  {/* <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="hover:opacity-80"
                    title="Add emoji"
                  >
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 28 29"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M19.4472 13.1117C20.1546 15.3075 19.6649 17.8105 17.9248 19.5517C16.7266 20.7499 15.1316 21.4097 13.4358 21.4097C11.7399 21.4097 10.1461 20.7499 8.9467 19.5517C6.47206 17.0748 6.47206 13.0482 8.9467 10.5736C10.1461 9.37312 11.7399 8.71336 13.4358 8.71336C14.0558 8.71336 14.6532 8.83126 15.2314 9.0013V7.34057C14.6408 7.20341 14.0388 7.12746 13.4358 7.12746C11.4055 7.12746 9.37407 7.90171 7.82444 9.45133C4.72519 12.5495 4.72519 17.5747 7.82444 20.6728C9.37407 22.2213 11.4055 22.9978 13.4358 22.9978C15.4672 22.9978 17.4974 22.2213 19.0471 20.6728C21.0977 18.6233 21.7836 15.7326 21.1204 13.1117H19.4472ZM20.3032 8.20068V6.00293H19.0298V8.20068H16.832V9.47733H19.0298V11.6709H20.3032V9.47733H22.5V8.20068H20.3032ZM8.85148 16.169C9.04873 16.9886 9.45115 17.7674 10.0905 18.4079C11.0144 19.3306 12.2251 19.7931 13.4358 19.7931C14.6476 19.7931 15.8571 19.3306 16.781 18.4079C17.4203 17.7674 17.8228 16.9886 18.02 16.169H16.5804C16.4194 16.6281 16.1666 17.0612 15.8016 17.4285C15.1702 18.0599 14.329 18.4079 13.4358 18.4079C12.5425 18.4079 11.7025 18.0599 11.0699 17.4285C10.7038 17.0612 10.4521 16.6281 10.2923 16.169H8.85148ZM14.2349 12.7682C14.2349 13.3951 14.7428 13.9018 15.3685 13.9018C15.9954 13.9018 16.5021 13.3951 16.5021 12.7682C16.5021 12.1425 15.9954 11.6346 15.3685 11.6346C14.7428 11.6346 14.2349 12.1425 14.2349 12.7682ZM12.6286 12.7682C12.6286 12.1425 12.1219 11.6346 11.495 11.6346C10.8693 11.6346 10.3614 12.1425 10.3614 12.7682C10.3614 13.3951 10.8693 13.9018 11.495 13.9018C12.1219 13.9018 12.6286 13.3951 12.6286 12.7682Z"
                        fill="#6C9BA6"
                      />
                    </svg>
                  </button> */}

                  {/* Insert Image Button */}
                  <label title="Insert image" className="hover:opacity-80 cursor-pointer">
                    {<svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M15.875 13.25C16.2458 13.25 16.6084 13.14 16.9167 12.934C17.225 12.728 17.4654 12.4351 17.6073 12.0925C17.7492 11.7499 17.7863 11.3729 17.714 11.0092C17.6416 10.6455 17.463 10.3114 17.2008 10.0492C16.9386 9.78695 16.6045 9.60837 16.2408 9.53603C15.8771 9.46368 15.5001 9.50081 15.1575 9.64273C14.8149 9.78464 14.522 10.025 14.316 10.3333C14.11 10.6416 14 11.0042 14 11.375C14 11.8723 14.1975 12.3492 14.5492 12.7008C14.9008 13.0525 15.3777 13.25 15.875 13.25ZM15.875 10.75C15.9986 10.75 16.1195 10.7867 16.2222 10.8553C16.325 10.924 16.4051 11.0216 16.4524 11.1358C16.4997 11.25 16.5121 11.3757 16.488 11.4969C16.4639 11.6182 16.4044 11.7295 16.3169 11.8169C16.2295 11.9043 16.1182 11.9639 15.9969 11.988C15.8757 12.0121 15.75 11.9997 15.6358 11.9524C15.5216 11.9051 15.424 11.825 15.3553 11.7222C15.2867 11.6195 15.25 11.4986 15.25 11.375C15.25 11.2092 15.3158 11.0503 15.4331 10.9331C15.5503 10.8158 15.7092 10.75 15.875 10.75Z" fill="#6C9BA6" />
                      <path d="M20.25 7H7.75C7.41848 7 7.10054 7.1317 6.86612 7.36612C6.6317 7.60054 6.5 7.91848 6.5 8.25V20.75C6.5 21.0815 6.6317 21.3995 6.86612 21.6339C7.10054 21.8683 7.41848 22 7.75 22H20.25C20.5815 22 20.8995 21.8683 21.1339 21.6339C21.3683 21.3995 21.5 21.0815 21.5 20.75V8.25C21.5 7.91848 21.3683 7.60054 21.1339 7.36612C20.8995 7.1317 20.5815 7 20.25 7ZM20.25 20.75H7.75V17L10.875 13.875L14.3688 17.3687C14.603 17.6016 14.9198 17.7322 15.25 17.7322C15.5802 17.7322 15.897 17.6016 16.1313 17.3687L17.125 16.375L20.25 19.5V20.75ZM20.25 17.7312L18.0063 15.4875C17.772 15.2547 17.4552 15.124 17.125 15.124C16.7948 15.124 16.478 15.2547 16.2437 15.4875L15.25 16.4812L11.7562 12.9875C11.522 12.7547 11.2052 12.624 10.875 12.624C10.5448 12.624 10.228 12.7547 9.99375 12.9875L7.75 15.2312V8.25H20.25V17.7312Z" fill="#6C9BA6" />
                    </svg>
                    }
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageInsert}
                      className="hidden"
                    />
                  </label>

                  <label title="Attach file" className="hover:opacity-80 cursor-pointer">
                    <svg
                      width="28"
                      height="29"
                      viewBox="0 0 28 29"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M15.3844 18.4485L12.9382 20.8947C11.4459 22.3472 9.05877 22.3148 7.60636 20.8225C6.18196 19.3591 6.18164 17.0276 7.60562 15.5637L10.0518 13.1152C10.3446 12.8222 10.3445 12.3473 10.0514 12.0545C9.7584 11.7616 9.2835 11.7618 8.99068 12.0548L6.54522 14.5033C4.48745 16.5621 4.48829 19.8992 6.54708 21.957C8.60587 24.0148 11.943 24.014 14.0008 21.9552L16.447 19.509C16.7348 19.2111 16.7265 18.7363 16.4286 18.4486C16.138 18.1679 15.6773 18.1679 15.3867 18.4486H15.3844V18.4485Z" fill="#6C9BA6" />
                      <path d="M21.4577 7.04559C20.472 6.05314 19.1301 5.49654 17.7313 5.50002C16.3334 5.49629 14.9919 6.05173 14.0058 7.0426L11.5558 9.48954C11.2628 9.78235 11.2626 10.2573 11.5554 10.5503C11.8483 10.8433 12.3232 10.8435 12.6162 10.5507L15.0646 8.10447C15.7698 7.39503 16.7295 6.99729 17.7298 6.99985C19.8122 7.00056 21.4998 8.68923 21.4991 10.7716C21.4988 11.7711 21.1017 12.7295 20.395 13.4363L17.9488 15.8825C17.6558 16.1756 17.6558 16.6507 17.9488 16.9437C18.2418 17.2367 18.7169 17.2367 19.0099 16.9437L21.4561 14.499C23.511 12.4396 23.5117 9.10571 21.4577 7.04559Z" fill="#6C9BA6" />
                      <path d="M15.7206 11.7193L11.2211 16.2187C10.9232 16.5065 10.915 16.9812 11.2027 17.2791C11.4904 17.577 11.9652 17.5852 12.2631 17.2975C12.2693 17.2915 12.2754 17.2854 12.2815 17.2791L16.7809 12.7796C17.0687 12.4817 17.0604 12.007 16.7625 11.7193C16.4719 11.4386 16.0112 11.4386 15.7206 11.7193Z" fill="#6C9BA6" />
                    </svg>

                    {/* Dummy file input */}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.txt,.zip,.csv,.xlsx"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          alert(`Selected file: ${file.name}`);
                        }
                      }}
                    />
                  </label>

                  {/* Formatting Dropdown Toggle */}
                  <button
                    type="button"
                    onClick={() => setShowFormattingPanel(!showFormattingPanel)}
                    title="Formatting options"
                    className="hover:opacity-80"
                  >
                    {<svg width="45" height="28" viewBox="0 0 45 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12.4615 18.3615L16.0846 9.90385C16.1188 9.82184 16.1765 9.75178 16.2504 9.7025C16.3243 9.65322 16.4112 9.62692 16.5 9.62692C16.5888 9.62692 16.6757 9.65322 16.7496 9.7025C16.8235 9.75178 16.8812 9.82184 16.9154 9.90385L20.5385 18.3615M13.8346 15.1538H19.1654M10.1538 6.5H22.8462C23.4834 6.5 24 7.01659 24 7.65385V20.3462C24 20.9834 23.4834 21.5 22.8462 21.5H10.1538C9.51659 21.5 9 20.9834 9 20.3462V7.65385C9 7.01659 9.51659 6.5 10.1538 6.5Z" stroke="#6C9BA6" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M31.4714 16.1104C31.2111 16.3708 30.7889 16.3708 30.5286 16.1104L27.1953 12.7771C26.9349 12.5167 26.9349 12.0946 27.1953 11.8343C27.4556 11.5739 27.7397 11.712 28 11.9723L31 14.9723L34 12.0003C34.2603 11.74 34.5444 11.5739 34.8047 11.8343C35.0651 12.0946 35.0651 12.5167 34.8047 12.7771L31.4714 16.1104Z" fill="#6C9BA6" />
                    </svg>
                    }
                  </button>
                </div>

                {/* Emoji Picker */}
                {showEmojiPicker && (
                  <div className="absolute z-10" style={{ bottom: "110%", right: "0" }}>
                    <EmojiPicker onEmojiClick={handleEmojiClick} />
                  </div>
                )}
              </div>

              {insertedImages.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-3">
                  {insertedImages.map((src, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={src}
                        alt={`uploaded-${i}`}
                        className="w-32 h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setInsertedImages((prev) => prev.filter((_, idx) => idx !== i))
                        }
                        className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full px-2 py-0.5 text-xs hidden group-hover:block"
                        title="Remove image"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Markdown Preview */}
              <div className="mt-2 p-3 border rounded bg-gray-50">
                <strong className="text-sm text-gray-500">Preview:</strong>
                <ReactMarkdown>{description}</ReactMarkdown>
              </div>
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
}

export default CreateQuestionDashboard;

// const PostQuestionDashboard: React.FC = () => {
//   const [questionTitle, setQuestionTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [selectedTags, setSelectedTags] = useState<string[]>([]);
//   const [error, setError] = useState("");
//   const [showSnackbar, setShowSnackbar] = useState(false);
//   const [showAllTags, setShowAllTags] = useState(false);
//   const [titleCharError, setTitleCharError] = useState("");

//   const availableTags = ["Career Development", "Job Search", "Education", "KeelWorks", "KCompass Help"];
//   const navigate = useNavigate();
//   const [showEmojiPicker, setShowEmojiPicker] = useState(false);
//   const [insertedImages, setInsertedImages] = useState<string[]>([]);


//   useEffect(() => {
//     const handleTagClick = (tag: string) => {
//       if (selectedTags.includes(tag)) {
//         setSelectedTags(selectedTags.filter((t) => t !== tag));
//       } else {
//         setSelectedTags([...selectedTags, tag]);
//       }
//     };

//     const handleSubmit = async (e: React.FormEvent) => {
//       e.preventDefault();


//       setError("");


//       const token = localStorage.getItem("token");
//       if (!token) {
//         alert("You must be logged in to post a question.");
//         return;
//       }

//       try {
//         const count = 100;
//         let offset = 0;
//         let isDuplicate = false;

//         while (offset !== -1 && !isDuplicate) {
//           const res = await api.get(`/questions?count=${count}&offset=${offset}`);
//           const data = res.data;
//           const questions = data.questions || [];

//           isDuplicate = questions.some(
//             (q: { title: string }) =>
//               q.title.trim().toLowerCase() === questionTitle.trim().toLowerCase()
//           );

//           offset = data.offset;
//         }

//         if (isDuplicate) {
//           setError("A question with this title already exists.");
//           setShowSnackbar(true);
//           setTimeout(() => setShowSnackbar(false), 4000);
//           return;
//         }


//         await api.post(
//           "/questions",
//           {
//             title: questionTitle,
//             description,
//             tags: selectedTags,
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );


//         navigate("/dashboard");
//       } catch (err: any) {
//         setError(err.message || "Something went wrong");
//         setShowSnackbar(true);
//         setTimeout(() => setShowSnackbar(false), 4000);
//       }
//     };


//     const handleClearDraft = () => {
//       localStorage.removeItem('questionDraft');
//       setQuestionTitle('');
//       setDescription('');
//       setSelectedTags([]);
//       alert('Draft cleared!');
//     };


//     const handleCancel = () => {
//       navigate("/dashboard");
//     };

//     const handleSaveDraft = () => {
//       const draftData = {
//         questionTitle,
//         description,
//         tags: selectedTags,
//         savedAt: new Date().toISOString(),
//       };
//       localStorage.setItem('questionDraft', JSON.stringify(draftData));
//       alert('Your draft has been saved!');
//     };

//     const [showFormattingPanel, setShowFormattingPanel] = useState(false);

//     const handleEmojiClick = (emojiData: any) => {
//       setDescription((prev) => prev + emojiData.emoji);
//     };

//     const handleImageInsert = (e: React.ChangeEvent<HTMLInputElement>) => {
//       const file = e.target.files?.[0];
//       if (file) {
//         const reader = new FileReader();
//         reader.onloadend = () => {
//           const base64 = reader.result as string;
//           setInsertedImages((prev) => [...prev, base64]);
//         };
//         reader.readAsDataURL(file);
//       }
//     };

//     return (
//       <div
//         className="flex items-center justify-center h-screen"
//         style={{
//           borderRadius: "7px",
//           padding: "28px 24px 24px 24px",
//         }}
//       >
//         <div
//           className="flex flex-col items-center"
//           style={{
//             width: "676px",
//             padding: "28px 24px 24px 24px",
//             boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
//             borderRadius: "7px",
//             backgroundColor: "#FFFFFF",
//           }}
//         >
//           <form className="flex flex-col gap-6 w-full" onSubmit={handleSubmit}>
//             <h1
//               style={{
//                 color: "#5E7A84",
//                 fontWeight: 600,
//                 fontSize: "20px",
//                 lineHeight: "24px",
//                 letterSpacing: "0%",
//               }}
//             >
//               Post your question
//             </h1>
//             {showSnackbar && error && (
//               <Snackbar message={error} onClose={() => setShowSnackbar(false)} />
//             )}

//             <div className="flex flex-col gap-2">
//               <label style={{ fontWeight: 600, fontSize: "16px" }}>
//                 Question Title<span style={{ color: "red" }}>*</span>
//               </label>
//               <input
//                 required
//                 type="text"
//                 id="questionTitle"
//                 name="questionTitle"
//                 value={questionTitle}
//                 onChange={(e) => {
//                   const value = e.target.value;
//                   if (value.length > 250) {
//                     setTitleCharError("Title cannot exceed 250 characters.");
//                   } else {
//                     setTitleCharError("");
//                   }
//                   setQuestionTitle(value);
//                 }}
//                 maxLength={256}
//                 className="px-3 py-2 focus:outline-none focus:ring-1"
//                 style={{
//                   width: "100%",
//                   height: "36px",
//                   fontSize: "16px",
//                   borderRadius: "3px",
//                   border: "1px solid #D1DBDD",
//                   backgroundColor: "#FFFFFF",
//                   color: "#063E53",
//                 }}
//               />
//               <div className="flex justify-between text-sm mt-1">
//                 <span style={{ color: "#5E7A84" }}>{questionTitle.length} / 250</span>
//                 {titleCharError && (
//                   <span className="text-red-500">{titleCharError}</span>
//                 )}
//               </div>

//             </div>


//             <div className="flex flex-col gap-2">
//               <label style={{ fontWeight: 600, fontSize: "16px" }}>
//                 Description
//               </label>
//               <div className="relative">
//                 <textarea
//                   id="description"
//                   name="description"
//                   value={description}
//                   onChange={(e) => setDescription(e.target.value)}
//                   className="px-3 py-2 focus:outline-none focus:ring-1"
//                   style={{
//                     width: "100%",
//                     height: "88px",
//                     fontSize: "16px",
//                     borderRadius: "3px",
//                     border: "1px solid #D1DBDD",
//                     backgroundColor: "#FFFFFF",
//                     color: "#063E53",
//                   }}
//                 />
//                 {/* Icon Toolbar */}
//                 <div className="absolute bottom-2 left-1 flex items-left">

//                   {/* Emoji Button */}
//                   <button
//                     type="button"
//                     onClick={() => setShowEmojiPicker(!showEmojiPicker)}
//                     className="hover:opacity-80"
//                     title="Add emoji"
//                   >
//                     <svg
//                       width="30"
//                       height="30"
//                       viewBox="0 0 28 29"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         clipRule="evenodd"
//                         d="M19.4472 13.1117C20.1546 15.3075 19.6649 17.8105 17.9248 19.5517C16.7266 20.7499 15.1316 21.4097 13.4358 21.4097C11.7399 21.4097 10.1461 20.7499 8.9467 19.5517C6.47206 17.0748 6.47206 13.0482 8.9467 10.5736C10.1461 9.37312 11.7399 8.71336 13.4358 8.71336C14.0558 8.71336 14.6532 8.83126 15.2314 9.0013V7.34057C14.6408 7.20341 14.0388 7.12746 13.4358 7.12746C11.4055 7.12746 9.37407 7.90171 7.82444 9.45133C4.72519 12.5495 4.72519 17.5747 7.82444 20.6728C9.37407 22.2213 11.4055 22.9978 13.4358 22.9978C15.4672 22.9978 17.4974 22.2213 19.0471 20.6728C21.0977 18.6233 21.7836 15.7326 21.1204 13.1117H19.4472ZM20.3032 8.20068V6.00293H19.0298V8.20068H16.832V9.47733H19.0298V11.6709H20.3032V9.47733H22.5V8.20068H20.3032ZM8.85148 16.169C9.04873 16.9886 9.45115 17.7674 10.0905 18.4079C11.0144 19.3306 12.2251 19.7931 13.4358 19.7931C14.6476 19.7931 15.8571 19.3306 16.781 18.4079C17.4203 17.7674 17.8228 16.9886 18.02 16.169H16.5804C16.4194 16.6281 16.1666 17.0612 15.8016 17.4285C15.1702 18.0599 14.329 18.4079 13.4358 18.4079C12.5425 18.4079 11.7025 18.0599 11.0699 17.4285C10.7038 17.0612 10.4521 16.6281 10.2923 16.169H8.85148ZM14.2349 12.7682C14.2349 13.3951 14.7428 13.9018 15.3685 13.9018C15.9954 13.9018 16.5021 13.3951 16.5021 12.7682C16.5021 12.1425 15.9954 11.6346 15.3685 11.6346C14.7428 11.6346 14.2349 12.1425 14.2349 12.7682ZM12.6286 12.7682C12.6286 12.1425 12.1219 11.6346 11.495 11.6346C10.8693 11.6346 10.3614 12.1425 10.3614 12.7682C10.3614 13.3951 10.8693 13.9018 11.495 13.9018C12.1219 13.9018 12.6286 13.3951 12.6286 12.7682Z"
//                         fill="#6C9BA6"
//                       />
//                     </svg>
//                   </button>

//                   {/* Insert Image Button */}
//                   <label title="Insert image" className="hover:opacity-80 cursor-pointer">
//                     {<svg width="28" height="29" viewBox="0 0 28 29" fill="none" xmlns="http://www.w3.org/2000/svg">
//                       <path d="M15.875 13.25C16.2458 13.25 16.6084 13.14 16.9167 12.934C17.225 12.728 17.4654 12.4351 17.6073 12.0925C17.7492 11.7499 17.7863 11.3729 17.714 11.0092C17.6416 10.6455 17.463 10.3114 17.2008 10.0492C16.9386 9.78695 16.6045 9.60837 16.2408 9.53603C15.8771 9.46368 15.5001 9.50081 15.1575 9.64273C14.8149 9.78464 14.522 10.025 14.316 10.3333C14.11 10.6416 14 11.0042 14 11.375C14 11.8723 14.1975 12.3492 14.5492 12.7008C14.9008 13.0525 15.3777 13.25 15.875 13.25ZM15.875 10.75C15.9986 10.75 16.1195 10.7867 16.2222 10.8553C16.325 10.924 16.4051 11.0216 16.4524 11.1358C16.4997 11.25 16.5121 11.3757 16.488 11.4969C16.4639 11.6182 16.4044 11.7295 16.3169 11.8169C16.2295 11.9043 16.1182 11.9639 15.9969 11.988C15.8757 12.0121 15.75 11.9997 15.6358 11.9524C15.5216 11.9051 15.424 11.825 15.3553 11.7222C15.2867 11.6195 15.25 11.4986 15.25 11.375C15.25 11.2092 15.3158 11.0503 15.4331 10.9331C15.5503 10.8158 15.7092 10.75 15.875 10.75Z" fill="#6C9BA6" />
//                       <path d="M20.25 7H7.75C7.41848 7 7.10054 7.1317 6.86612 7.36612C6.6317 7.60054 6.5 7.91848 6.5 8.25V20.75C6.5 21.0815 6.6317 21.3995 6.86612 21.6339C7.10054 21.8683 7.41848 22 7.75 22H20.25C20.5815 22 20.8995 21.8683 21.1339 21.6339C21.3683 21.3995 21.5 21.0815 21.5 20.75V8.25C21.5 7.91848 21.3683 7.60054 21.1339 7.36612C20.8995 7.1317 20.5815 7 20.25 7ZM20.25 20.75H7.75V17L10.875 13.875L14.3688 17.3687C14.603 17.6016 14.9198 17.7322 15.25 17.7322C15.5802 17.7322 15.897 17.6016 16.1313 17.3687L17.125 16.375L20.25 19.5V20.75ZM20.25 17.7312L18.0063 15.4875C17.772 15.2547 17.4552 15.124 17.125 15.124C16.7948 15.124 16.478 15.2547 16.2437 15.4875L15.25 16.4812L11.7562 12.9875C11.522 12.7547 11.2052 12.624 10.875 12.624C10.5448 12.624 10.228 12.7547 9.99375 12.9875L7.75 15.2312V8.25H20.25V17.7312Z" fill="#6C9BA6" />
//                     </svg>
//                     }
//                     <input
//                       type="file"
//                       accept="image/*"
//                       onChange={handleImageInsert}
//                       className="hidden"
//                     />
//                   </label>

//                   <label title="Attach file" className="hover:opacity-80 cursor-pointer">
//                     <svg
//                       width="28"
//                       height="29"
//                       viewBox="0 0 28 29"
//                       fill="none"
//                       xmlns="http://www.w3.org/2000/svg"
//                     >
//                       <path d="M15.3844 18.4485L12.9382 20.8947C11.4459 22.3472 9.05877 22.3148 7.60636 20.8225C6.18196 19.3591 6.18164 17.0276 7.60562 15.5637L10.0518 13.1152C10.3446 12.8222 10.3445 12.3473 10.0514 12.0545C9.7584 11.7616 9.2835 11.7618 8.99068 12.0548L6.54522 14.5033C4.48745 16.5621 4.48829 19.8992 6.54708 21.957C8.60587 24.0148 11.943 24.014 14.0008 21.9552L16.447 19.509C16.7348 19.2111 16.7265 18.7363 16.4286 18.4486C16.138 18.1679 15.6773 18.1679 15.3867 18.4486H15.3844V18.4485Z" fill="#6C9BA6" />
//                       <path d="M21.4577 7.04559C20.472 6.05314 19.1301 5.49654 17.7313 5.50002C16.3334 5.49629 14.9919 6.05173 14.0058 7.0426L11.5558 9.48954C11.2628 9.78235 11.2626 10.2573 11.5554 10.5503C11.8483 10.8433 12.3232 10.8435 12.6162 10.5507L15.0646 8.10447C15.7698 7.39503 16.7295 6.99729 17.7298 6.99985C19.8122 7.00056 21.4998 8.68923 21.4991 10.7716C21.4988 11.7711 21.1017 12.7295 20.395 13.4363L17.9488 15.8825C17.6558 16.1756 17.6558 16.6507 17.9488 16.9437C18.2418 17.2367 18.7169 17.2367 19.0099 16.9437L21.4561 14.499C23.511 12.4396 23.5117 9.10571 21.4577 7.04559Z" fill="#6C9BA6" />
//                       <path d="M15.7206 11.7193L11.2211 16.2187C10.9232 16.5065 10.915 16.9812 11.2027 17.2791C11.4904 17.577 11.9652 17.5852 12.2631 17.2975C12.2693 17.2915 12.2754 17.2854 12.2815 17.2791L16.7809 12.7796C17.0687 12.4817 17.0604 12.007 16.7625 11.7193C16.4719 11.4386 16.0112 11.4386 15.7206 11.7193Z" fill="#6C9BA6" />
//                     </svg>

//                     {/* Dummy file input */}
//                     <input
//                       type="file"
//                       accept=".pdf,.doc,.docx,.txt,.zip,.csv,.xlsx"
//                       className="hidden"
//                       onChange={(e) => {
//                         const file = e.target.files?.[0];
//                         if (file) {
//                           alert(`Selected file: ${file.name}`);
//                         }
//                       }}
//                     />
//                   </label>

//                   {/* Formatting Dropdown Toggle */}
//                   <button
//                     type="button"
//                     onClick={() => setShowFormattingPanel(!showFormattingPanel)}
//                     title="Formatting options"
//                     className="hover:opacity-80"
//                   >
//                     {<svg width="45" height="28" viewBox="0 0 45 28" fill="none" xmlns="http://www.w3.org/2000/svg">
//                       <path d="M12.4615 18.3615L16.0846 9.90385C16.1188 9.82184 16.1765 9.75178 16.2504 9.7025C16.3243 9.65322 16.4112 9.62692 16.5 9.62692C16.5888 9.62692 16.6757 9.65322 16.7496 9.7025C16.8235 9.75178 16.8812 9.82184 16.9154 9.90385L20.5385 18.3615M13.8346 15.1538H19.1654M10.1538 6.5H22.8462C23.4834 6.5 24 7.01659 24 7.65385V20.3462C24 20.9834 23.4834 21.5 22.8462 21.5H10.1538C9.51659 21.5 9 20.9834 9 20.3462V7.65385C9 7.01659 9.51659 6.5 10.1538 6.5Z" stroke="#6C9BA6" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round" />
//                       <path fill-rule="evenodd" clip-rule="evenodd" d="M31.4714 16.1104C31.2111 16.3708 30.7889 16.3708 30.5286 16.1104L27.1953 12.7771C26.9349 12.5167 26.9349 12.0946 27.1953 11.8343C27.4556 11.5739 27.7397 11.712 28 11.9723L31 14.9723L34 12.0003C34.2603 11.74 34.5444 11.5739 34.8047 11.8343C35.0651 12.0946 35.0651 12.5167 34.8047 12.7771L31.4714 16.1104Z" fill="#6C9BA6" />
//                     </svg>
//                     }
//                   </button>
//                 </div>

//                 {/* Emoji Picker */}
//                 {showEmojiPicker && (
//                   <div className="absolute z-10" style={{ bottom: "110%", right: "0" }}>
//                     <EmojiPicker onEmojiClick={handleEmojiClick} />
//                   </div>
//                 )}
//               </div>

//               {insertedImages.length > 0 && (
//                 <div className="mt-2 flex flex-wrap gap-3">
//                   {insertedImages.map((src, i) => (
//                     <div key={i} className="relative group">
//                       <img
//                         src={src}
//                         alt={`uploaded-${i}`}
//                         className="w-32 h-20 object-cover rounded border"
//                       />
//                       <button
//                         type="button"
//                         onClick={() =>
//                           setInsertedImages((prev) => prev.filter((_, idx) => idx !== i))
//                         }
//                         className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full px-2 py-0.5 text-xs hidden group-hover:block"
//                         title="Remove image"
//                       >
//                         ✕
//                       </button>
//                     </div>
//                   ))}
//                 </div>
//               )}

//               {/* Markdown Preview */}
//               <div className="mt-2 p-3 border rounded bg-gray-50">
//                 <strong className="text-sm text-gray-500">Preview:</strong>
//                 <ReactMarkdown>{description}</ReactMarkdown>
//               </div>
//             </div>

//             <div className="flex flex-col gap-2">
//               <div className="flex items-center gap-2 flex-wrap">
//                 {(showAllTags ? availableTags : availableTags.slice(0, 3)).map((tag, index) => (
//                   <button
//                     key={index}
//                     type="button"
//                     onClick={() => handleTagClick(tag)}
//                     className="flex items-center px-3 py-1 font-medium border border-gray-300 rounded-full"
//                     style={{
//                       height: "36px",
//                       borderRadius: "18px",
//                       color: selectedTags.includes(tag) ? "#FFFFFF" : "#063E53",
//                       backgroundColor: selectedTags.includes(tag)
//                         ? "#116989"
//                         : "#064C651A",
//                     }}
//                   >
//                     {selectedTags.includes(tag) ? "✓ " : "+ "}
//                     {tag}
//                   </button>
//                 ))}
//               </div>
//               {availableTags.length > 3 && (
//                 <button
//                   type="button"
//                   onClick={() => setShowAllTags(!showAllTags)}
//                   className="px-3 py-1 font-medium border border-gray-300 rounded-full transition hover:opacity-80"
//                   style={{
//                     height: "36px",
//                     borderRadius: "18px",
//                     color: "#116989",
//                     backgroundColor: "#064C651A",
//                   }}
//                 >
//                   {showAllTags ? "− Show Less" : "+ More Tags"}
//                 </button>

//               )}
//             </div>


//             <div className="flex items-center gap-6">
//               <button
//                 type="submit"
//                 className="px-4 py-2 font-medium rounded-md"
//                 style={{
//                   width: "94px",
//                   height: "40px",
//                   backgroundColor: "#116989",
//                   color: "#FFFFFF",
//                 }}
//               >
//                 Post
//               </button>
//               <button
//                 type="button"
//                 onClick={handleSaveDraft}
//                 className="px-4 py-2 font-medium border rounded-md"
//                 style={{
//                   width: "94px",
//                   height: "40px",
//                   color: "#116989",
//                   borderColor: "#11698980",
//                 }}
//               >
//                 Save
//               </button>
//               <button
//                 type="button"
//                 onClick={handleClearDraft}
//                 className="px-4 py-2 font-medium border rounded-md text-red-500 border-red-500"
//                 style={{
//                   width: "120px",
//                   height: "40px",
//                   color: "#116989",
//                   borderColor: "#11698980",
//                 }}
//               >
//                 Clear Draft
//               </button>
//               <button
//                 onClick={handleCancel}
//                 type="button"
//                 className="px-4 py-2 font-medium hover:underline"
//                 style={{
//                   width: "94px",
//                   height: "40px",
//                   color: "#116989",
//                 }}
//               >
//                 Cancel
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     );
//   };

//   export default PostQuestionDashboard;
