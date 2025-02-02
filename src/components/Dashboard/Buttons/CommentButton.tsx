const CommentButton = () => {

  return (
    <button className = "flex items-center space-x-1 text-gray-500 hover:text-gray-600">

      <img
      src="/images/comment.svg"
      alt = "comment"
      
      className="w-4 h-4 cursor-pointer"
      ></img>
      <span>{4}</span>
    </button>
  
  )
}
   
  
  export default CommentButton;
  