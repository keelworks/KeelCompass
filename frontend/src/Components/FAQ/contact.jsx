import React from "react";

const Contact = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-full md:w-2/3 lg:w-1/2 p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-700 text-3xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex flex-col lg:flex-row justify-center items-center text-center lg:text-left">
          <div className="w-full lg:w-1/2 p-4 lg:pr-6">
            <h3 className="text-2xl font-semibold mb-4 text-blue-500">Contact Us</h3>
            <p className="leading-relaxed mb-6">
              Contact us anytime! Our team is here to help with any inquiries or assistance you need.
              We prioritize your satisfaction and are committed to providing prompt and excellent customer service.
              Reach out to us using the contact details below – we can't wait to hear from you!
            </p>
            <div className="flex items-center justify-center lg:justify-start mb-2">
              <i className="fas fa-envelope text-blue-500 mr-2"></i>
              <a href="mailto:Keelworkshelp@gmail.com" className="text-blue-500">Keelworkshelp@gmail.com</a>
            </div>
            <div className="flex items-center justify-center lg:justify-start">
              <i className="fas fa-phone-alt text-blue-500 mr-2"></i>
              <a href="tel:+17878986767" className="text-blue-500">+1 (787) 898-6767</a>
            </div>
          </div>
          <div className="w-full lg:w-1/2 p-4 lg:pl-6">
            <form className="text-left">
              <div className="mb-4">
                <label className="block text-gray-700">Category</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md bg-transparent"
                  placeholder="Enter your category"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-md bg-transparent"
                  placeholder="Enter your name"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border border-gray-300 rounded-md bg-transparent"
                  placeholder="Enter your email"
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Message</label>
                <textarea
                  className="w-full p-2 border border-gray-300 rounded-md bg-transparent"
                  rows="4"
                  placeholder="Enter your message"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md w-full"
              >
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
