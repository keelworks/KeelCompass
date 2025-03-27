import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "../components/Navigation/Navigation";
import CategoryFilter from "../components/qna/CategoryFilter";
import QnACard2 from "../components/qna/QnACard";
import FilterTab from "../components/qna/FilterTab";
import SearchBar from "../components/SearchBar";

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
          <div className="w-full">
            <SearchBar></SearchBar>
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
                  color: "#00929C",
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
