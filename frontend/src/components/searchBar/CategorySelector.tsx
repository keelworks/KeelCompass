import { useEffect, useState } from "react";

function CategorySelector() {
    const categories = [
        { name: "Career Development" }, 
        { name: "Job Search" }, 
        { name: "Education" }, 
        { name: "KeelWorks" },  
        { name: "KCompass Help" }
    ];

    const [isOpen, setIsOpen] = useState(false);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const toggleDropdown = () => setIsOpen((prev) => !prev);

    const handleCheckboxChange = (category: string) => {
        setSelectedCategories((prevSelected) =>
            prevSelected.includes(category)
                ? prevSelected.filter((c) => c !== category)
                : [...prevSelected, category]
        );
    };

    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (!event.target.closest("#dropdown-container") && !event.target.closest(".form-checkbox")) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex-shrink-0 relative" id="dropdown-container">
            <button
                type="button"
                onClick={toggleDropdown}
                className="ml-2 mr-5 bg-white text-gray-600 text-sm rounded-lg border border-cyan-600 px-2 py-1 flex items-center space-x-2 focus:ring-cyan-600 focus:border-cyan-600"
            >
                {selectedCategories.length > 0 && (
                    <span className="inline-flex items-center justify-center w-10 h-5 text-xs font-semibold text-white bg-cyan-600 rounded-full">
                        {selectedCategories.length} X
                    </span>
                )}
                <span>𝑨𝒍𝒍</span>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`w-4 h-4 transform ${isOpen ? "rotate-180" : ""}`}
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

            {isOpen && (
                <div className="absolute z-10 mt-2 w-56 bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
                    <div className="max-h-60 overflow-y-auto p-3">
                        {categories.map((category, index) => (
                            <label key={index} className="flex items-center space-x-2 py-1 whitespace-nowrap">
                                <input
                                    type="checkbox"
                                    value={category.name}
                                    checked={selectedCategories.includes(category.name)}
                                    onChange={() => handleCheckboxChange(category.name)}
                                    className="form-checkbox text-cyan-600 border-gray-300 focus:ring-cyan-600"
                                />
                                <span className="text-gray-600 text-sm">{category.name}</span>
                            </label>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default CategorySelector;