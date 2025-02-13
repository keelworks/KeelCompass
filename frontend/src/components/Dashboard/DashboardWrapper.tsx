import React from "react";
import  Navigation  from "../Navigation/Navigation";

interface DashboardWrapperProps {
  children: React.ReactNode;
}

const DashboardWrapper: React.FC<DashboardWrapperProps> = ({ children }) => {
  return (
          <div className="flex min-h-screen">
      {/* Navigation on the left */}
      <div className="flex-none w-[240px] bg-gray-100">
        <Navigation />
      </div>

      {/* Main content area for dashboard */}
      <div className="flex-1 bg-gray-200 flex justify-center items-start py-8">
        <div className="w-full max-w-7xl px-4">
          <div className="grid grid-cols-3 gap-6">
            {children}
          </div>
        </div>
      </div>
    </div>

  );
};

export default DashboardWrapper;