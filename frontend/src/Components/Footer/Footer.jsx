import React from "react";
import './Footer.css';

const Footer = () => {
  const section1 = [
    {
      title: "Keelworks",
      items:
        "Lorem ipsum dolor sit amet consectetur. Vel pharetra enim pulvinar velit pretium orci. Vitae massa. Lorem ipsum dolor sit amet consectetur.",
    },
  ];

  const section2 = [
    {
      title: "More",
      items: ["About", "Explore Resources", "Find Opportunities", "Join Our Community"],
    },
    {
      title: "Categories",
      items: ["Education", "Housing", "Jobs", "xxxxxx"],
    },
  ];

  const icons = [
    {
      name: "facebook",
      icon: "facebook",
    },
    {
      name: "twitter",
      icon: "twitter",
    },
    {
      name: "linkedin",
      icon: "linkedin",
    },
  ];

  return (
    <footer className="bg-[#0070FF] w-full text-white py-4 px-2">
      <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row justify-between">
        <div className="flex-shrink-0 w-full md:w-1/4 px-4 py-2">
          {section1.map((section, index) => (
            <div key={index}>
              <h6 className="font-bold pt-2 text-xl">{section.title}</h6>
              <p className="text-white mt-2">{section.items}</p>
              <div className="flex justify-center space-x-4 py-4">
                {icons.map((icon, index) => (
                  <div key={index} className={`text-2xl ${icon.icon}`}>
                    {icon.name}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex-shrink-0 w-full md:w-3/4 flex flex-wrap justify-end px-4 py-2 md:ml-5">
          {section2.map((section, index) => (
            <div key={index} className="flex-shrink-0 w-[200px] px-2 py-2">
              <h6 className="font-bold pt-2 text-xl">{section.title}</h6>
              <ul>
                {section.items.map((item, i) => (
                  <li key={i} className="py-1 text-white mt-2 cursor-pointer">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <div className="max-w-[1240px] mx-auto py-4 mb-8">
        <div className="bg-white h-[1px] w-full"></div>
      </div>
      <div className="max-w-[1240px] mx-auto flex flex-col md:flex-row justify-between items-center text-white mb-10">
        <div className="text-center md:text-left text-sm md:text-base">
          KeelWorks © 2023 | All Rights Reserved
        </div>
        <div className="mt-4 md:mt-0 text-sm md:text-base">Privacy Policy</div>
      </div>
    </footer>
  );
};

export default Footer;
