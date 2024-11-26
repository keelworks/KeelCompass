import React from "react";

interface DashboardWrapperProps {
  children: React.ReactNode;
}

const DashboardWrapper: React.FC<DashboardWrapperProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start py-8">
      {/* Main content container */}
      <div className="w-full max-w-7xl px-4">
        <div className="grid grid-cols-3 gap-6">{children}</div>
      </div>
    </div>
  );
};

export default DashboardWrapper;
