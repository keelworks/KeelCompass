import { IconType } from "react-icons";

interface EmptyStateProps {
  icon: IconType;
  title: string;
  description?: string;
  action?: React.ReactNode;
  compact?: boolean;
  className?: string;
}

// shared "nothing here" treatment - icon + message instead of a bare line
// of text, used anywhere a list/feed can legitimately be empty
function EmptyState({ icon: Icon, title, description, action, compact = false, className = "" }: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${compact ? "py-6" : "py-12"} px-4 ${className}`}>
      <div
        className={`rounded-full bg-brand-50 dark:bg-teal-900/30 flex items-center justify-center mb-3 ${
          compact ? "w-9 h-9" : "w-12 h-12"
        }`}
      >
        <Icon className="text-brand-700 dark:text-teal-300" size={compact ? 16 : 22} />
      </div>
      <p className={`font-medium text-gray-700 dark:text-gray-200 ${compact ? "text-sm" : "text-base"}`}>{title}</p>
      {description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export default EmptyState;
