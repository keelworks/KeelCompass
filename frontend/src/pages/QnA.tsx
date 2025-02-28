import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation/Navigation";
import CategoryFilter from "../components/qna/CategoryFilter";
import { CiSearch } from "react-icons/ci";
import QnACard2 from "../components/qna/QnACard2";
import FilterTab from "../components/qna/FilterTab";

const QnA = () => {
  const navigate = useNavigate();

  const categories = [
    "Career Development",
    "Job Search",
    "Education",
    "KeelWorks",
    "KCompass Help",
  ];

  const subcategories = ["Posted", "Bookmarked", "Drafts"];

  // State to manage selected main category
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>(
    categories[0]
  );

  const handleFilterChange = (mainCategory: string) => {
    console.log("Selected Category:", mainCategory);

    // Update the selected main category to reset subcategory in QnACard2
    setSelectedMainCategory(mainCategory);
  };

  const handleAskQuestionClick = () => {
    navigate("/post-question"); // Navigate to PostQuestion page
  };

  return (
    <div className="flex h-screen">
      {/* Navigation on the left */}
      <div className="flex-none w-[240px] bg-gray-100">
        <Navigation />
      </div>

      {/* Rest of the content */}
      <div className="flex-1 flex flex-col px-6 pt-6 bg-[#F0F0F0]">
        {/* Add heading and search bar */}
        <div
          className="flex items-center justify-between mb-6"
          style={{
            width: "676px",
            height: "44px",
          }}
        >
          {/* Q&A Discussions Heading */}
          <h1
            className="font-lato font-medium text-[26px] text-[#444444]"
            style={{
              width: "272px",
              height: "25px",
              lineHeight: "25px",
              textAlign: "left",
            }}
          >
            Q&A Discussions
          </h1>

          {/* Search Bar */}
          <div
            className="flex items-center rounded-[8px] shadow-sm"
            style={{
              width: "236px",
              height: "44px",
              backgroundColor: "#FFFFFF",
              padding: "5px 10px",
            }}
          >
            <input
              type="text"
              placeholder="Search"
              className="w-full h-full bg-transparent text-black text-sm font-lato focus:outline-none"
              style={{
                marginRight: "10px",
              }}
            />
            <div
              className="flex items-center justify-center"
              style={{
                width: "32px",
                height: "32px",
              }}
            >
              <CiSearch size={20} color="#8B5E83" />
            </div>
          </div>
        </div>

        {/* CategoryFilter (Only Main Categories) */}
        <div className="flex">
          <div>
            <div className="mb-4">
              <CategoryFilter
                categories={categories}
                onFilterChange={(mainCategory) =>
                  handleFilterChange(mainCategory)
                }
              />
            </div>

            {/* QnACard2 (Subcategories only rendered here) */}
            <div className="flex-grow">
              <QnACard2
                subcategories={subcategories}
                selectedMainCategory={selectedMainCategory}
                // Pass submitted questions if needed
              />
            </div>
          </div>

          <div>
            {/* Ask Question Button */}
            <div className="flex mt-11 ml-5 absolute flex-col">
              <button
                onClick={handleAskQuestionClick}
                className="rounded-md text-white font-lato text-sm"
                style={{
                  width: "231px",
                  height: "45px",
                  backgroundColor: "#D2EEF0",
                  color:"#00929C"
                }}
              >
                Ask Question
              </button>
              <div className="flex flex-col mt-3">
              <FilterTab></FilterTab>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QnA;
