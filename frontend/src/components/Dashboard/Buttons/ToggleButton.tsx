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
    <div className="flex items-center bg-gray-200 rounded-full w-fit p-0.5">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => handleToggle(option)}
          className={`px-4 py-2 text-sm font-normal rounded-full ${
            selected === option
            ? "bg-customGreen text-white" // Custom green background and white text
            : "bg-white text-gray-600 hover:bg-gray-300" // Default styles
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default ToggleButton;
