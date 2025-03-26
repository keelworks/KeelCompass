import React, { useState } from "react";

interface ToggleButtonProps {
  options: string[];
  onToggle: (selected: string) => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ options, onToggle }) => {
  const [selected, setSelected] = useState(options[0]); // Default to the first option

  const handleToggle = (option: string) => {
    setSelected(option);
    onToggle(option); // Notify parent about the selected option
  };

  return (
    <div className="flex items-center bg-gray-200 rounded-md w-fit p-0.5 border border-gray-300">
      {options.map((option, index) => (
        <button
          key={option}
          onClick={() => handleToggle(option)}
          className={`px-4 py-2 text-sm font-normal border-r border-gray-300 ${
            selected === option
              ? "bg-custom-gradient text-white" // Selected state
              : "bg-white text-gray-600 hover:bg-gray-300"
          } ${index === 0 ? "rounded-l-md" : ""} ${index === options.length - 1 ? "rounded-r-md border-r-0" : ""}`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default ToggleButton;
