interface InterestItemProps {
  title: string;
  date: string;
  commentCount?: number;
  onClick?: () => void; // modal
}

function InterestItem({
  title,
  date,
  commentCount,
  onClick,
}: InterestItemProps) {
  return (
    <div
      className="bg-white dark:bg-gray-900 shadow-md rounded-lg border border-gray-200 dark:border-gray-700 p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={onClick}
    >
      {/* Title */}
      <h3 className="text-lg font-semibold text-[#004466] dark:text-teal-300 leading-relaxed mb-3">
        {title}
      </h3>

      <div className="flex items-center justify-between w-full text-sm text-gray-500 dark:text-gray-400 flex-wrap gap-2">
        <span>{date}</span>
        {commentCount !== undefined && (
          <span>
            {commentCount} comment{commentCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>
    </div>
  );
}

export default InterestItem;
