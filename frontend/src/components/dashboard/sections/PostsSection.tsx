// src/components/posts/PostsSection.tsx
import React, { useEffect } from "react";
import { useStore } from "../../../utils/store";
import PostCard from "../cards/PostCard";
import Backdrop from "../modals/BackkDrop";
import ToggleButton from "../buttons/ToggleButton";

const PostsSection: React.FC = () => {
  const { questions, offset, isLoading, error, fetchQuestions } = useStore();

  useEffect(() => {
    // For example, fetch 3 items starting from offset 0
    fetchQuestions(10, 0);
  }, [fetchQuestions]);

  if (isLoading && questions.length === 0) {
    return <div>Loading posts...</div>;
  }

  if (error && questions.length === 0) {
    return <div className="text-red-500">Error: {error}</div>;
  }
const handleToggle = (selected: string) => {
   
      console.log(`Selected option: ${selected}`);
    // if (selected === "Most Recent") {
    //   setFilteredPosts(
    //     [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    //   );
    // } else if (selected === "Popular") {
    //   // Add logic for "Popular" sorting if needed
    //   setFilteredPosts(posts); // Default to original order for now
    }
  
  return (
    <Backdrop className="mb-6" style={{width: "100%"}}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium uppercase tracking-wide">Posts</h2>
        <ToggleButton options={["Most Recent", "Popular"]} onToggle={handleToggle}/>
      </div>

      {questions.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <div className="space-y-4 overflow-y-scroll max-h-[80vh]">
          {questions.map((q) => (
            <PostCard key={q.id} question={q} />
          ))}
        </div>
      )}

      {/* "View more posts" link to load next batch (if offset != -1) */}
      {offset !== -1 && (
        <div className="mt-4 text-left">
          <button
            onClick={() => fetchQuestions(3, offset)}
            className="bg-custom-gradient bg-clip-text  cursor-pointer text-transparent transition hover:opacity-80"
          >
             View more posts <span className="inline-block w-0 h-0 ml-1 
                  border-l-[5px] border-r-[5px] border-t-[6px]
                  border-l-transparent border-r-transparent border-t-teal-500"></span>
          </button>
        </div>
      )}
    </Backdrop>
  );
};

export default PostsSection;
