// shared building block for skeleton loaders - a pulsing grey bar standing
// in for text/avatars/etc. while real content is still loading
export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-gray-200 dark:bg-gray-700 ${className}`} />;
}

// stands in for a QuestionItem card while the feed is loading
export function QuestionCardSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-4 flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <Skeleton className="w-7 h-7 rounded-full shrink-0" />
        <Skeleton className="h-3 w-40" />
      </div>
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <div className="flex items-center justify-between">
        <Skeleton className="h-5 w-20 rounded-full" />
        <div className="flex items-center gap-3">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    </div>
  );
}

// stands in for a notification row while the list is loading
export function NotificationRowSkeleton() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 flex flex-col gap-2">
      <Skeleton className="h-3.5 w-2/3" />
      <Skeleton className="h-2.5 w-20" />
    </div>
  );
}
