import React from "react";
import Navigation from "../navigation/Navigation";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      {/* Navigation - remains exactly as before */}
      <div className="flex-none bg-gray-100">
        <Navigation />
      </div>

      {/* Main content - automatically adjusts to navigation width changes */}
      <div className="flex-1 bg-[#F0F0F0] min-w-0"> {/* min-w-0 prevents overflow */}
        <div className="w-full max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-3 gap-32">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;