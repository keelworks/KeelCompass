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
    <div className="flex space-x-2 bg-gray-200 p-2 rounded-lg">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => handleToggle(option)}
          className={`px-4 py-2 rounded-md ${
            selected === option
              ? "bg-blue-500 text-white"
              : "bg-white text-gray-600 hover:bg-gray-300"
          }`}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default ToggleButton;
