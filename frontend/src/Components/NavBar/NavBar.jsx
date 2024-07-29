import React from "react";

const NavBar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white p-4 text-black shadow-lg font-sans">
      <div className="container mx-auto flex flex-col md:flex-row md:justify-between items-center">
        <a href="/" className="text-black text-2xl font-bold">
          <img 
            src="/images/keel-works-logo.png" 
            alt="keelworks" 
            className="max-h-[61px]" 
          />
        </a>
        <input
          type="text"
          placeholder="What do you want to know?"
          className="border rounded-full py-2 px-4 focus:outline-none focus:border-blue-500 bg-[#DBEAFD] w-full max-w-[746px] h-[50px]"
        />
        <ul className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 mt-4 md:mt-0">
          <li className="flex items-center">
            <a 
              className="w-[35px] h-[35px] bg-black text-white rounded-full flex items-center justify-center text-[18px] cursor-pointer" 
              href="#"
            >
              ?
            </a>
          </li>
          <li>
            <a
              className="inline-block text-center w-full md:w-[100px] border border-black rounded-full py-2 px-4 bg-transparent text-black text-[1rem]"
              href="#"
            >
              Log In
            </a>
          </li>
          <li>
            <a
              className="inline-block text-center w-full md:w-[100px] border border-[#0070FF] bg-[#0070FF] rounded-full py-2 px-4 text-white text-[1rem]"
              href="#"
            >
              Sign Up
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default NavBar;
