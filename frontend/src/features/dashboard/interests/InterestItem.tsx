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
      className="bg-white shadow-md rounded-lg border border-gray-200 p-6 mb-4 cursor-pointer hover:shadow-lg transition-shadow duration-200"
      onClick={onClick}
    >
      {/* Title */}
      <h3 className="text-lg font-semibold text-[#004466] leading-relaxed mb-3">
        {title}
      </h3>

      {/* Date and Comments below title */}
      <div className="flex items-center text-sm text-gray-500">
        <span>{date}</span>
        {commentCount !== undefined && (
          <>
            <span className="mx-2">•</span>
            <span>
              {commentCount} comment{commentCount !== 1 ? 's' : ''}
            </span>
          </>
        )}
      </div>
    </div>
  );
}

export default InterestItem;
