import React from "react";
import Navigation from "../navigation/Sidebar";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar navigation */}
      <div className="flex-none w-[240px] bg-gray-100">
        <Navigation />
      </div>

      {/* Main content */}
      <div className="flex-1 bg-[#F0F0F0] flex justify-center items-start py-8">
        <div className="w-full max-w-7xl px-4">
          <div className="grid grid-cols-3 gap-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
