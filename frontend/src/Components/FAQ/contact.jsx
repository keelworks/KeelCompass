import React from "react";

const Contact = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-1/3 p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-700"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-4">Contact Us</h3>
          <p>
            Contact us anytime! Our team is here to help with any inquiries
            or assistance you need. We prioritize your satisfaction and are
            committed to providing prompt and excellent customer service.
            Reach out to us using the contact details below – we can't wait
            to hear from you!
          </p>
          <div className="mt-4">
            <p>Email: <a href="mailto:Keelworkshelp@gmail.com">Keelworkshelp@gmail.com</a></p>
            <p>Phone: <a href="tel:+17878986767">+1 (787) 898-6767</a></p>
          </div>
          <form className="mt-4 text-left">
            <div className="mb-4">
              <label className="block text-gray-700">Category</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Message</label>
              <textarea
                className="w-full p-2 border border-gray-300 rounded-md"
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
  );
};

export default Contact;
