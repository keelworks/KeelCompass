import React, { useState } from "react";

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    "What is a knowledge base?",
    "How do I navigate through a knowledge base?",
    "Can I access the knowledge base from any device?",
    "Are there any user guides available in the knowledge base?",
    "Can I submit feedback or suggest new topics for the knowledge base?",
    "How often is the knowledge base updated?",
    "Are there video tutorials available in the knowledge base?",
    "Is the knowledge base searchable by keywords?",
    "Can I share articles from the knowledge base with my colleagues?",
    "Is there a customer support team available if I can’t find the answer I need in the knowledge base?",
  ];

  return (
    <div className="p-6 font-sans">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Frequently Asked Questions
      </h2>
      <div className="flex justify-center">
        <div className="mr-6">
          <ul className="list-none p-0">
            <li className="mb-2">
              <a href="#top10faq" className="text-blue-500">
                Top 10 FAQ
              </a>
            </li>
            <li className="mb-2">
              <a href="#education" className="text-blue-500">
                Education
              </a>
            </li>
            <li className="mb-2">
              <a href="#jobs" className="text-blue-500">
                Jobs
              </a>
            </li>
            <li className="mb-2">
              <a href="#housing" className="text-blue-500">
                Housing
              </a>
            </li>
          </ul>
        </div>
        <div>
          {faqData.map((faq, index) => (
            <div key={index} className="mb-4">
              <div
                className={`bg-white p-4 cursor-pointer rounded-md border flex justify-between items-center ${
                  activeIndex === index
                    ? "border-blue-500 text-blue-500"
                    : "border-gray-300"
                }`}
                onClick={() => toggleFAQ(index)}
              >
                {faq}
                <i
                  className={`fas fa-chevron-down transform transition-transform ${
                    activeIndex === index ? "rotate-180" : ""
                  }`}
                ></i>
              </div>
              <div
                className={`overflow-hidden transition-max-height duration-300 ease-in-out ${
                  activeIndex === index ? "max-h-40" : "max-h-0"
                }`}
              >
                <div className="p-4 bg-blue-500 text-white border border-gray-300 rounded-md mt-2">
                  Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                  Officia sed adipisci dolorem ea blanditiis vitae obcaecati
                  dolorum facilis fugiat nulla expedita exercitationem, cumque
                  voluptatibus, iusto hic illo in neque ex.
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-10 text-center">
        <h3 className="text-xl font-semibold mb-2">
          Ask a different question?
        </h3>
        <p className="mb-4">
          Lorem ipsum dolor sit amet consectetur adipisicing elit.
        </p>
        <button className="bg-blue-500 text-white py-2 px-6 rounded-md">
          Contact Us
        </button>
      </div>
    </div>
  );
};

export default FAQ;
