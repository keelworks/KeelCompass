import React from "react";
import { FaSquarePlus } from "react-icons/fa6";
import { GiGraduateCap } from "react-icons/gi";
import { PiSuitcaseSimpleFill } from "react-icons/pi";
import { FaHouseChimney } from "react-icons/fa6";
import { GoLaw } from "react-icons/go";

const Home = () => {
  return (
    <div className="flex h-screen">
      {/* Left Section */}
      <div className="w-1/6 h-full flex flex-col">
        <div className="h-2/6 flex flex-col justify-between">
          <div className="bg-white mt-12">
            <ul className=" w-2/3 text-left ml-20">
              <li className="text-gray-700 hover:text-black focus:text-black cursor-pointer transition duration-200 text-md hover:bg-blue-100 focus:bg-blue-100 hover:rounded-l-full focus:rounded-l-full hover:pl-4 pl-4 py-2 rounded-l-full">
                Home
              </li>
              <li className="text-gray-700 hover:text-black focus:text-black cursor-pointer transition duration-200 text-md hover:bg-blue-100 focus:bg-blue-100 hover:rounded-l-full focus:rounded-l-full hover:pl-4 pl-4 py-2 rounded-l-full">
                Articles
              </li>
              <li className="text-gray-700 hover:text-black focus:text-black cursor-pointer transition duration-200 text-md hover:bg-blue-100 focus:bg-blue-100 hover:rounded-l-full focus:rounded-l-full hover:pl-4 pl-4 py-2 rounded-l-full">
                About
              </li>
              <li className="text-gray-700 hover:text-black focus:text-black cursor-pointer transition duration-200 text-md hover:bg-blue-100 focus:bg-blue-100 hover:rounded-l-full focus:rounded-l-full hover:pl-4 pl-4 py-2 rounded-l-full">
                Contact
              </li>
            </ul>
          </div>
          <div className="w-full bg-gray-300 h-0.5 mb-10"></div>
        </div>
        <div className="h-4/6 flex flex-col">
          {/* Content for the bottom section */}
          <div className="bg-white">
            <ul className="text-left ml-20">
              <li className="text-gray-700 hover:text-black focus:text-black cursor-pointer transition duration-200 text-lg pl-4 mb-5 ">
                Categories
              </li>
              <li className="text-gray-700 hover:text-black focus:text-black cursor-pointer transition duration-200 text-sm hover:bg-blue-100 focus:bg-blue-100 hover:rounded-l-full focus:rounded-l-full hover:pl-4 pl-4 py-2 rounded-l-full">
                <div className="flex items-center space-x-2">
                  <FaSquarePlus />
                  <span>Create new</span>
                </div>
              </li>
              <li className="text-gray-700 hover:text-black focus:text-black cursor-pointer transition duration-200 text-sm hover:bg-blue-100 focus:bg-blue-100 hover:rounded-l-full focus:rounded-l-full hover:pl-4 pl-4 py-2 rounded-l-full">
                <div className="flex items-center space-x-2">
                  <GiGraduateCap />
                  <span>Education</span>
                </div>
              </li>
              <li className="text-gray-700 hover:text-black focus:text-black cursor-pointer transition duration-200 text-sm hover:bg-blue-100 focus:bg-blue-100 hover:rounded-l-full focus:rounded-l-full hover:pl-4 pl-4 py-2 rounded-l-full">
                <div className="flex items-center space-x-2">
                  <PiSuitcaseSimpleFill />
                  <span>Employment</span>
                </div>
              </li>
              <li className="text-gray-700 hover:text-black focus:text-black cursor-pointer transition duration-200 text-sm hover:bg-blue-100 focus:bg-blue-100 hover:rounded-l-full focus:rounded-l-full hover:pl-4 pl-4 py-2 rounded-l-full">
                <div className="flex items-center space-x-2">
                  <FaHouseChimney />
                  <span>Housing</span>
                </div>
              </li>
              <li className="text-gray-700 hover:text-black focus:text-black cursor-pointer transition duration-200 text-sm hover:bg-blue-100 focus:bg-blue-100 hover:rounded-l-full focus:rounded-l-full hover:pl-4 pl-4 py-2 rounded-l-full">
                <div className="flex items-center space-x-2">
                  <GoLaw />
                  <span>Legal Advisory</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {/* divider line */}
      <div className="w-0.5 bg-gray-300 h-full"></div>
      {/* middle section */}
      <div className="w-4/6 h-full flex items-center justify-center">
        <div></div>
      </div>

      {/* Divider Line */}
      <div className="w-0.5 bg-gray-300 h-full"></div>

      <div className="w-1/6 h-full flex items-center justify-center"></div>
    </div>
  );
};

export default Home;
