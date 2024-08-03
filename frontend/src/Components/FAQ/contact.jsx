import React from "react";

const Contact = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-blue-500 rounded-lg w-1/2 py-20 px-20 relative">
        <button
          className="absolute top-2 right-2 text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="flex">
          <div className=" w-1/2 text-white pr-4 py-8">
            <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
            <p>
              Contact us anytime! Our team is here to help with any inquiries or
              assistance you need. We prioritize your satisfaction and are
              committed to providing prompt and excellent customer service.
              Reach out to us using the contact details below – we can't wait to
              hear from you!
            </p>
            <div className="mt-4">
              <p>
                Email:{" "}
                <a href="mailto:Keelworkshelp@gmail.com">
                  Keelworkshelp@gmail.com
                </a>
              </p>
              <p>
                Phone: <a href="tel:+17878986767">+1 (787) 898-6767</a>
              </p>
            </div>
          </div>
          <div className="w-1/2 bg-white py-4 px-8 rounded-md">
            <form className="mt-4 text-left py-6">
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Category"
                  className="w-full bg-slate-100 p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Name"
                  className="w-full bg-slate-100 p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <input
                  type="email"
                  placeholder="Email"
                  className="w-full bg-slate-100 p-2 border border-gray-300 rounded-md"
                />
              </div>
              <div className="mb-4">
                <textarea
                  placeholder="Message"
                  className="w-full bg-slate-100 p-2 border border-gray-300 rounded-md"
                  rows="4"
                ></textarea>
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded-md"
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
