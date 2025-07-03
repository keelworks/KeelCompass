import { useEffect, useState, useRef } from "react";
import { Category, QuestionsResponse } from "../../utils/types";
import { searchQuestions } from "../../utils/store";

type SearchBarProps = {
  pageSize: number;
  setQuestions: (questions: QuestionsResponse) => void;
  setSearchActive: (active: boolean) => void;
};

function SearchBar({ pageSize, setQuestions, setSearchActive }: SearchBarProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [noCategory, setNoCategory] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const handleCategoryChange = (id: number) => {
    setNoCategory(false);
    setSelectedCategories((prev) =>
      prev.includes(id)
        ? prev.filter((catId) => catId !== id)
        : [...prev, id]
    );
  };

  const handleNoCategoryChange = () => {
    if (!noCategory) {
      setNoCategory(true);
      setSelectedCategories([]);
    } else {
      setNoCategory(false);
    }
  };

  const handleSearch = async () => {
    try {
      const res = await searchQuestions({
        query: searchInput,
        count: pageSize,
        offset: 0,
        categoriesIds: noCategory ? [] : selectedCategories,
        hasNone: noCategory,
      });
      setQuestions({
        questions: res.questions,
        count: res.count,
        offset: res.offset === -1 ? 0 : res.offset,
      });
      setSearchActive(true);
    } catch (err) {
      console.error(err);
    }
  };

  // fetch categories from localStorage
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

  // close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <form className="max-w-4xl mx-auto" onSubmit={e => { e.preventDefault(); handleSearch(); }}>
        <div className="flex w-full">
          <div className="relative items-center w-full bg-white flex px-1 py-1 rounded-lg border mx-auto">
            {/* Category Dropdown */}
            <div className="flex-shrink-0 relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((open) => !open)}
                className="ml-2 mr-5 bg-white text-gray-600 text-sm rounded-lg border border-cyan-600 px-2 py-1 flex items-center space-x-2 focus:ring-cyan-600 focus:border-cyan-600"
              >
                <span>Categories</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-4 h-4 transform ${dropdownOpen ? "rotate-180" : ""}`}
                  viewBox="0 0 10 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M1 1l4 4 4-4" />
                </svg>
              </button>

              {dropdownOpen && (
                <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-10">
                  <label className="flex items-center space-x-2 py-1">
                    <input
                      type="checkbox"
                      value="no-category"
                      checked={noCategory}
                      onChange={handleNoCategoryChange}
                      className="form-checkbox text-cyan-600 border-gray-300 focus:ring-cyan-600"
                    />
                    <span className="text-gray-600 text-sm">No Category</span>
                  </label>
                  {categories.map((category) => (
                    <label key={category.id} className="flex items-center space-x-2 py-1">
                      <input
                        type="checkbox"
                        value={category.id}
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleCategoryChange(category.id)}
                        disabled={noCategory}
                        className="form-checkbox text-cyan-600 border-gray-300 focus:ring-cyan-600"
                      />
                      <span className="text-gray-600 text-sm">{category.name}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Search input and button */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 192.904 192.904"
              width="35px"
              className="text-gray-400"
              fill="currentColor"
            >
              <path d="m190.707 180.101-47.078-47.077c11.702-14.072 18.752-32.142 18.752-51.831C162.381 36.423 125.959 0 81.191 0 36.422 0 0 36.423 0 81.193c0 44.767 36.422 81.187 81.191 81.187 19.688 0 37.759-7.049 51.831-18.751l47.079 47.078a7.474 7.474 0 0 0 5.303 2.197 7.498 7.498 0 0 0 5.303-12.803zM15 81.193C15 44.694 44.693 15 81.191 15c36.497 0 66.189 29.694 66.189 66.193 0 36.496-29.692 66.187-66.189 66.187C44.693 147.38 15 117.689 15 81.193z"></path>
            </svg>
            <input
              type="search"
              placeholder="Search something..."
              className="w-full outline-none bg-white pl-4 text-sm"
              required
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit" className="bg-gray-200 hover:bg-cyan-600 transition-all text-cyan-600 hover:text-white text-sm rounded-lg px-5 py-2.5">
              Search
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default SearchBar;
