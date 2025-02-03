import React, { useState } from "react";
import PostCard from "../Cards/PostCard";
import ToggleButton from "../Buttons/ToggleButton";

const PostsSection = () => {
  const [filter, setFilter] = useState("Most Recent");

  const handleToggle = (selected: string) => {
    setFilter(selected);
  };

  const posts = [
    { title: "Post 1", content: "This is the first post...", author: "John Doe", date: "Nov 20" },
    { title: "Post 2", content: "Here's some more content...", author: "Jane Smith", date: "Nov 19" },
  ];

  const filteredPosts = filter === "Most Recent" ? posts : [...posts].reverse();

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Posts</h2>
        <ToggleButton options={["Most Recent", "Popular"]} onToggle={handleToggle} />
      </div>
      <div className="space-y-4">
        {filteredPosts.map((post, index) => (
          <PostCard key={index} {...post} />
        ))}
      </div>
    </div>
  );

};

export default PostsSection;
