import  { useState } from "react";
import PostCard from "../Cards/PostCard";
import ToggleButton from "../Buttons/ToggleButton";
import Backdrop from "../Modals/Backdrop";

const PostsSection = () => {
  const [filter, setFilter] = useState("Most Recent");

  const handleToggle = (selected: string) => {
    setFilter(selected);
  };

  const posts = [
    { id: 1, title: "How can I get colleges to respond to my scholarship question ?", content: "I dont know what to do. I am not sure if I am contacting right....", author: "Kevin Smith", date: "Dec 4, 2024" },
    { id: 2, title: "What are onboarding challenges for new employess ?", content: "Recently out team took survey with new employers and here is what we interesting detail we found..", author: "Michael Young", date: "Dec 1, 2024" },
  ];

  const filteredPosts = filter === "Most Recent" ? posts : [...posts].reverse();

  return (
    <div>
      <Backdrop className="mb-6" style={{width: "100%"}}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">Posts</h2>
        <ToggleButton options={["Most Recent", "Popular"]} onToggle={handleToggle} />
      </div>
      <div className="space-y-4">
        {filteredPosts.map(({id, ...post}) => (
          <PostCard key={id} {...post} />
        ))}
      </div>
      </Backdrop>
    </div>
  );

};

export default PostsSection;
