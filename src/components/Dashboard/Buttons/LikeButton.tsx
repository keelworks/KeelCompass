import { useState } from "react";

const LikeButton = () => {

  const [likes, setLikes] = useState(3);

    return (
      <button  className= "flex items-center space-x-1 text-gray-700 hover:text-blue-500">
      <img
        src= "/images/like-svgrepo-com.svg" 
        alt="like"
        onClick={() => setLikes(likes + 1)}
        className="w-3 h-3 cursor-pointer"
      />
      <span>{likes}</span>
      </button>
    )

    
    };
  
  export default LikeButton;
  