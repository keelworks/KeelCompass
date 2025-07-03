import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../components/wrappers/MainLayout";
import CategoryFilter from "../features/qna/CategoryFilter";
import QnACard2 from "../features/qna/QnACard";
import FilterTab from "../features/qna/FilterTab";

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

  const [selectedMainCategory, setSelectedMainCategory] = useState<string>(categories[0]);

  const handleFilterChange = (mainCategory: string) => {
    setSelectedMainCategory(mainCategory);
  };

  const handleAskQuestionClick = () => {
    navigate("/questions/new");
  };

  return (
    <MainLayout>
      {/* Left Column */}
      <div className="col-span-2 flex flex-col">
        <div
          className="flex items-center justify-between mb-6"
          style={{ width: "676px", height: "44px" }}
        >
        </div>

        <div className="mb-4">
          <CategoryFilter
            categories={categories}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="flex-grow">
          <QnACard2
            subcategories={subcategories}
            selectedMainCategory={selectedMainCategory}
          />
        </div>
      </div>

      {/* Right Column */}
      <div className="col-span-1 flex flex-col">
        <div className="mb-4 mt-11">
          <button
            onClick={handleAskQuestionClick}
            className="rounded-md text-white font-lato text-sm w-[231px] h-[45px]"
            style={{ backgroundColor: "#D2EEF0", color: "#00929C" }}
          >
            Ask Question
          </button>
        </div>
        <FilterTab />
      </div>
    </MainLayout>
  );
};

export default QnA;
