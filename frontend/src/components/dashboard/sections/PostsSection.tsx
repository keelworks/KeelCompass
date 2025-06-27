// src/components/posts/PostsSection.tsx
import React, { useEffect, useState } from "react";
import { useStore } from "../../../utils/store";
import PostCard from "../cards/PostCard";
import Backdrop from "../modals/BackkDrop";
import ToggleButton from "../buttons/ToggleButton";
// Add props interface
interface PostsSectionProps {
  refreshInterests: () => void;
}

const PostsSection: React.FC = ({ refreshInterests }) => {
  const { questions, offset, isLoading, error, fetchQuestions } = useStore();
<<<<<<< HEAD
  const [visiblePosts, setVisiblePosts] = useState(4);
  const [sortOption, setSortOption] = useState<"Most Recent" | "Popular">("Most Recent");
  const [sortedQuestions, setSortedQuestions] = useState(questions);

  useEffect(() => {
    fetchQuestions(6, 0);
=======
  console.log("function check PostsSection",typeof refreshInterests);

  useEffect(() => {
    // For example, fetch 3 items starting from offset 0
    fetchQuestions(10, 0);
>>>>>>> origin/main
  }, [fetchQuestions]);

  // Apply sorting when sort option or questions change
  useEffect(() => {
    let sorted = [...questions];
    if (sortOption === "Popular") {
      sorted.sort((a, b) => {
        const popularityA = (a.likeCount || 0) + (a.commentCount || 0);
        const popularityB = (b.likeCount || 0) + (b.commentCount || 0);
        return popularityB - popularityA; // Descending order
      });
    } else {
      // Most Recent - sort by creation date (newest first)
      sorted.sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }
    setSortedQuestions(sorted);
  }, [questions, sortOption]);

  const handleShowMore = () => {
    if (visiblePosts >= sortedQuestions.length && offset !== -1) {
      fetchQuestions(3, offset);
    }
    setVisiblePosts(prev => prev + 3);
  };

  const handleToggle = (selected: string) => {
    const option = selected as "Most Recent" | "Popular";
    setSortOption(option);
    // Reset visible posts when changing sort
    setVisiblePosts(4);
  };

  if (isLoading && questions.length === 0) {
    return <div>Loading posts...</div>;
  }

  if (error && questions.length === 0) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <Backdrop 
      className="mb-6" 
      style={{ 
        width: "100%",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-medium uppercase tracking-wide">Posts</h2>
        <ToggleButton options={["Most Recent", "Popular"]} onToggle={handleToggle} />
      </div>

      {sortedQuestions.length === 0 ? (
        <p>No posts found.</p>
      ) : (
<<<<<<< HEAD
        <div className="space-y-4">
          {sortedQuestions.slice(0, visiblePosts).map((q) => (
            <PostCard key={q.id} question={q} />
=======
        <div className="space-y-4 overflow-y-scroll max-h-[80vh]">
          {questions.map((q) => (
            <PostCard key={q.id} question={q} refreshInterests={refreshInterests} />
>>>>>>> origin/main
          ))}
        </div>
      )}

      {(sortedQuestions.length > visiblePosts || offset !== -1) && (
        <div className="mt-4 text-left">
          <button
            onClick={handleShowMore}
            className="bg-custom-gradient bg-clip-text cursor-pointer text-transparent transition hover:opacity-80"
          >
            View more posts{" "}
            <span className="inline-block w-0 h-0 ml-1 
                  border-l-[5px] border-r-[5px] border-t-[6px]
                  border-l-transparent border-r-transparent border-t-teal-500"></span>
          </button>
        </div>
      )}
    </Backdrop>
  );
};

export default PostsSection;