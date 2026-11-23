import { usePageTitle } from "../utils/usePageTitle";

const Fallback = () => {
  usePageTitle("Page not found");
  return (
    <div className="flex justify-center items-center h-screen">
      <h1 className="text-2xl font-semibold">Page not found</h1>
    </div>
  );
};

export default Fallback;
