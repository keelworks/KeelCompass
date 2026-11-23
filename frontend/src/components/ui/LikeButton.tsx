import { useEffect, useRef, useState } from "react";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";

interface LikeButtonProps {
  liked: boolean;
  count: number;
  onToggle: (e: React.MouseEvent) => void;
  size?: "sm" | "md";
}

// Animates with a little pop whenever the liked state flips, instead of the
// icon/color just snapping between states.
function LikeButton({ liked, count, onToggle, size = "sm" }: LikeButtonProps) {
  const [popping, setPopping] = useState(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setPopping(true);
    const timer = setTimeout(() => setPopping(false), 400);
    return () => clearTimeout(timer);
  }, [liked]);

  const iconSize = size === "md" ? 15 : 13;
  const safeCount = typeof count === "number" && !isNaN(count) ? count : 0;

  return (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center gap-1.5 text-sm select-none transition-colors duration-150 active:scale-95 ${
        liked
          ? "text-blue-600 dark:text-blue-400"
          : "text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
      }`}
    >
      <span className={`inline-flex ${popping ? "animate-like-pop" : ""}`}>
        {liked ? <FaThumbsUp size={iconSize} /> : <FaRegThumbsUp size={iconSize} />}
      </span>
      <span>
        {safeCount} {safeCount === 1 ? "Like" : "Likes"}
      </span>
    </button>
  );
}

export default LikeButton;
