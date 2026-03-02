import { useEffect, useState, useRef } from "react";
import { Category, QuestionsResponse } from "../../../utils/types";
import { searchQuestions } from "../../../utils/store";

type SearchBarProps = {
  pageSize: number;
  setQuestions: (questions: QuestionsResponse) => void;
  setSearchActive: (active: boolean) => void;
};

function SearchBar({
  pageSize,
  setQuestions,
  setSearchActive,
}: SearchBarProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [appliedCategories, setAppliedCategories] = useState<number[]>([]);
  const [appliedNoCategory, setAppliedNoCategory] = useState(false);
  const [pendingCategories, setPendingCategories] = useState<number[]>([]);
  const [pendingNoCategory, setPendingNoCategory] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const debounceRef = useRef<number | null>(null);

  const handleCategoryChange = (id: number) => {
    setPendingNoCategory(false);
    setPendingCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  const handleNoCategoryChange = () => {
    if (!pendingNoCategory) {
      setPendingNoCategory(true);
      setPendingCategories([]);
    } else {
      setPendingNoCategory(false);
    }
  };

  const runSearch = async (
    query: string,
    categoryIds: number[],
    hasNone: boolean
  ) => {
    const trimmedQuery = query.trim();
    const hasFilters = hasNone || categoryIds.length > 0;

    // Empty query + no filters means return to dashboard default list.
    if (!trimmedQuery && !hasFilters) {
      setSearchActive(false);
      setQuestions({
        questions: [],
        count: pageSize,
        offset: 0,
      });
      return;
    }

    try {
      const res = await searchQuestions({
        query: trimmedQuery,
        count: pageSize,
        offset: 0,
        categoriesIds: hasNone ? [] : categoryIds,
        hasNone,
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

  const handleSearch = async () => {
    await runSearch(searchInput, appliedCategories, appliedNoCategory);
  };

  const applyFilters = async () => {
    setAppliedCategories(pendingCategories);
    setAppliedNoCategory(pendingNoCategory);
    setDropdownOpen(false);
    await runSearch(searchInput, pendingCategories, pendingNoCategory);
  };

  const clearFilters = async () => {
    setPendingCategories([]);
    setPendingNoCategory(false);
    setAppliedCategories([]);
    setAppliedNoCategory(false);
    await runSearch(searchInput, [], false);
  };

  const clearSearch = async () => {
    setSearchInput("");
    await runSearch("", appliedCategories, appliedNoCategory);
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
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // debounce keyword search; filters are applied only via Apply button
  useEffect(() => {
    if (debounceRef.current) {
      window.clearTimeout(debounceRef.current);
    }

    debounceRef.current = window.setTimeout(() => {
      runSearch(searchInput, appliedCategories, appliedNoCategory);
    }, 350);

    return () => {
      if (debounceRef.current) {
        window.clearTimeout(debounceRef.current);
      }
    };
  }, [searchInput, appliedCategories, appliedNoCategory]);

  // when opening dropdown, start from currently applied filter state
  useEffect(() => {
    if (dropdownOpen) {
      setPendingCategories(appliedCategories);
      setPendingNoCategory(appliedNoCategory);
    }
  }, [dropdownOpen, appliedCategories, appliedNoCategory]);

  return (
    <>
      <form
        className="max-w-4xl mx-auto"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <div className="flex w-full">
          <div className="relative items-center w-full bg-white flex px-1 py-1 rounded-lg border mx-auto">
            {/* Category Dropdown */}
            <div className="flex-shrink-0 relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen((open) => !open)}
                className="ml-2 mr-5 flex items-center justify-between gap-2
              px-2.5 py-1.5 w-[63px] h-[30px] bg-white border border-[#00929C1A] rounded-[3px]"
              >
                <span className="text-gray-800 text-sm">All</span>
                <div className="w-[18px] h-[18px] rounded-full bg-[#9BAAAB1A] flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-[6.67px] h-[4px] transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                    viewBox="0 0 10 6"
                    fill="none"
                  >
                    <path
                      d="M1 1L5 5L9 1"
                      stroke="#00929C"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </button>

              {dropdownOpen && (
                <div className="absolute mt-2 w-55 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-10">
                  <label className="flex items-center space-x-2 py-1">
                    <input
                      type="checkbox"
                      value="no-category"
                      checked={pendingNoCategory}
                      onChange={handleNoCategoryChange}
                      className="form-checkbox text-cyan-600 border-gray-300 focus:ring-cyan-600"
                    />
                    <span className="text-gray-600 text-sm">No Category</span>
                  </label>
                  {categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center space-x-2 py-1"
                    >
                      <input
                        type="checkbox"
                        value={category.id}
                        checked={pendingCategories.includes(category.id)}
                        onChange={() => handleCategoryChange(category.id)}
                        disabled={pendingNoCategory}
                        className="form-checkbox text-cyan-600 border-gray-300 focus:ring-cyan-600"
                      />
                      <span className="text-gray-600 text-sm">
                        {category.name}
                      </span>
                    </label>
                  ))}

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="px-2 py-1 text-xs rounded border border-gray-300 text-gray-600 hover:bg-gray-50"
                    >
                      Clear all
                    </button>
                    <button
                      type="button"
                      onClick={applyFilters}
                      className="px-3 py-1 text-xs rounded bg-cyan-600 text-white hover:bg-cyan-700"
                    >
                      Apply
                    </button>
                  </div>
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
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <button
                type="button"
                onClick={clearSearch}
                className="px-2 text-gray-400 hover:text-gray-700"
                aria-label="Clear search"
              >
                x
              </button>
            )}
            <button
              type="submit"
              className="bg-[#EFEFEF] shadow-[0px_1px_2px_0px_#0A0D120D] text-cyan-600 text-sm rounded-lg px-5 py-2.5 transition-all"
            >
              Search
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

export default SearchBar;
