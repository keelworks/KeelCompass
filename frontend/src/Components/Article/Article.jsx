const Article = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-16">
      {/* Header with Breadcrumb and Search Bar */}
      <div className="flex justify-between items-center mb-6">
        {/* Breadcrumb */}
        <div className="text-sm text-gray-500">
          <a href="#" className="hover:text-blue-500">
            Keelworks
          </a>{" "}
          {">"}{" "}
          <a href="#" className="hover:text-blue-500">
            Education
          </a>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Type something"
            className="px-4 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button className="absolute right-0 top-0 bottom-0 bg-blue-500 text-white px-4 rounded-r-lg hover:bg-blue-600">
            Search
          </button>
        </div>
      </div>

      <div className="flex flex-row gap-8">
        {/* Left Sidebar with Category Links */}
        <div className="w-1/4">
          <h3 className="text-xl font-semibold mb-4">
            Articles in this category
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="hover:text-blue-500 cursor-pointer">
              How is education funded in the US?
            </li>
            <li className="hover:text-blue-500 cursor-pointer">
              Education research topics and ideas
            </li>
            <li className="hover:text-blue-500 cursor-pointer">
              Child development in low-income families
            </li>
            <li className="hover:text-blue-500 cursor-pointer">
              How can divorce impact child growth?
            </li>
          </ul>
        </div>

        {/* Main Article Section */}
        <div className="w-3/4 bg-white p-10 rounded-lg shadow-md">
          {/* Article Title */}
          <h1 className="text-3xl font-bold mb-4">
            According to the US department of Education, the Federal Government
            contributes about 8% to funding US public schools.
          </h1>

          {/* Author Info */}
          <div className="flex items-center mb-6">
            <img
              src="https://via.placeholder.com/50"
              alt="Author"
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <p className="text-gray-700 font-semibold">Mary Ann</p>
              <p className="text-sm text-gray-500">5 months ago · 47 likes</p>
            </div>
          </div>

          {/* Article Content */}
          <div className="text-gray-700 leading-relaxed space-y-4">
            <p>
              Due to a varied levels of income throughout states and within
              local communities, education funding suffers from inequalities
              where some communities have excessive funding and others are
              lacking important resources to support students. According to the
              research on Equity and Adequacy in School Funding, much of the
              current litigation and legislative activity in education funding
              seeks to assure adequacy.
            </p>
            <p>
              Because income and tax revenue varies so widely from district to
              district, the current school funding model has led to a huge
              disparity in the funding that schools in different parts of a
              single state receive.
            </p>
            <p>
              Primarily, schools in affluent areas receive more funding as
              compared to those located in low-income areas.
            </p>
            <p>
              Due to varied levels of income throughout states and within local
              communities, education funding suffers from inequalities where
              some communities have excessive funding and others are lacking
              important resources to support students.
            </p>
          </div>

          {/* Tags */}
          <div className="mt-6">
            <span className="inline-block bg-blue-100 text-blue-500 px-3 py-1 rounded-full text-sm font-semibold mr-2">
              housing
            </span>
            <span className="inline-block bg-blue-100 text-blue-500 px-3 py-1 rounded-full text-sm font-semibold mr-2">
              education
            </span>
            <span className="inline-block bg-blue-100 text-blue-500 px-3 py-1 rounded-full text-sm font-semibold mr-2">
              career
            </span>
            <span className="inline-block bg-blue-100 text-blue-500 px-3 py-1 rounded-full text-sm font-semibold">
              jobs
            </span>
          </div>
        </div>
      </div>

      {/* Feedback Section */}
      <div className="mt-12 text-center">
        <p className="text-gray-600 text-lg mb-4">Did you find it helpful?</p>
        <div className="space-x-4">
          <button className="bg-gray-200 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
            Yes
          </button>
          <button className="bg-gray-200 text-gray-600 px-6 py-2 rounded-lg hover:bg-gray-300 transition">
            No
          </button>
        </div>
        <div className="mt-4">
          <a href="#" className="text-blue-500 hover:underline">
            Contact us
          </a>
        </div>
      </div>
    </div>
  );
};

export default Article;
