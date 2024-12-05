import  { useState } from "react";
import PostCard from "../Cards/PostCard";
import ToggleButton from "../Buttons/ToggleButton";
import Backdrop from "../Modals/Backdrop";


interface Post {
  id: number;
  title: string;
  content: string;
  date: string; // Ensure date is a valid ISO 8601 string
  author:string;
}


const PostsSection = () => {
  

  const [posts, setPosts] = useState<Post[]>( [
    { id: 2, title: "What are onboarding challenges for new employess ?", content: "Recently out team took survey with new employers and here is what we interesting detail we found..", author: "Michael Young", date: "Dec 1, 2024" },
    { id: 1, title: "How can I get colleges to respond to my scholarship question ?", content: "I dont know what to do. I am not sure if I am contacting right....", author: "Kevin Smith", date: "Dec 4, 2024" },
    
    { id: 3, title: "Tips to increase daily productivity?", content: "Here are a few routines that I follow..", author: "Magnus Carlson", date: "Nov 30, 2024" }
  ]);

  const [filteredPosts, setFilteredPosts] = useState<Post[]>(posts);

  const handleToggle = (selected: string) => {
    if (selected === "Most Recent") {
      setFilteredPosts(
        [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      );
    } else if (selected === "Popular") {
      // Add logic for "Popular" sorting if needed
      setFilteredPosts(posts); // Default to original order for now
    }
  };


  return (
    <div>
      <Backdrop className="mb-6" style={{width: "100%"}}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-medium text-[#4A4A4A] uppercase tracking-wide">Posts</h2>
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
