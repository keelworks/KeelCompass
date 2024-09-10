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

      {/* Divider Line */}
      <div className="w-0.5 bg-gray-300 h-full"></div>

      {/* Middle Section (Main Content) */}
      <div className="w-4/6 h-full flex flex-col p-8">
        {/* Question Form */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">Ask your Question</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Give a title"
              className="w-full px-4 py-2 border rounded-md"
            />
            <textarea
              placeholder="Post a detailed question here. Include relevant images and use appropriate tags. Additionally, you may select a category that best fits your question."
              className="w-full h-32 px-4 py-2 border rounded-md"
            />
            <div className="flex space-x-4">
              <select
                name="category"
                className="border px-4 py-2 rounded-md w-1/3"
              >
                <option>Select Category</option>
                <option>Employment</option>
                <option>Housing</option>
                <option>Education</option>
                <option>Legal Advisory</option>
              </select>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Post
              </button>
            </div>
          </form>
        </div>

        {/* Top Questions */}
        <div className="space-y-6">
          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold">
              How to find the job that fits your personality
            </h3>
            <span className="inline-block bg-blue-100 text-blue-500 px-3 py-1 rounded-full text-sm font-semibold my-2">
              Employment
            </span>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet consectetur. Dictum quis donec...
            </p>
            <div className="text-blue-500 mt-2">
              <a href="#" className="mr-2">
                #jobs
              </a>
              <a href="#" className="mr-2">
                #careeradvice
              </a>
              <a href="#">#technology</a>
            </div>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6">
            <h3 className="text-xl font-bold">How to find housing</h3>
            <span className="inline-block bg-blue-100 text-blue-500 px-3 py-1 rounded-full text-sm font-semibold my-2">
              Housing
            </span>
            <p className="text-gray-600">
              Lorem ipsum dolor sit amet consectetur. Dictum quis donec...
            </p>
          </div>
        </div>
      </div>

      {/* Divider Line */}
      <div className="w-0.5 bg-gray-300 h-full"></div>

      {/* Right Section (Empty or for Ads/Login/Sign Up Section) */}
      <div className="w-1/6 h-full flex items-center justify-center"></div>
    </div>
  );
};

export default Home;
