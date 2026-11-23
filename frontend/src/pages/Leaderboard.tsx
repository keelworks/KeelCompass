import { useEffect, useState } from "react";
import { LeaderboardEntry } from "../utils/types";
import { getLeaderboard } from "../utils/store";
import MainLayout from "../components/wrappers/MainLayout";
import { Skeleton } from "../components/ui/Skeleton";
import { usePageTitle } from "../utils/usePageTitle";

const Leaderboard = () => {
  usePageTitle("Leaderboard");
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getLeaderboard()
      .then(setEntries)
      .catch(() => setEntries([]))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <MainLayout>
      <div className="col-span-1 lg:col-span-3">
        <div className="shadow-md rounded-lg p-6 bg-gray-50 dark:bg-gray-800">
          <h2 className="text-xl font-medium uppercase tracking-wide text-gray-900 dark:text-gray-100 mb-4">
            Leaderboard
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            Top contributors by reputation - earned from likes on your questions and
            comments, and from having an answer accepted.
          </p>

          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-14" />
              <Skeleton className="h-14" />
              <Skeleton className="h-14" />
            </div>
          ) : entries.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No one has earned reputation yet - be the first!
            </p>
          ) : (
            <div className="space-y-2">
              {entries.map((entry, index) => (
                <div
                  key={entry.id}
                  className="flex items-center gap-4 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3"
                >
                  <span className="w-6 text-center font-semibold text-gray-400">{index + 1}</span>
                  {entry.pictureUrl ? (
                    <img
                      src={entry.pictureUrl}
                      alt=""
                      referrerPolicy="no-referrer"
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 font-semibold text-sm">
                      {(entry.displayName || entry.username || "?").charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="flex-1 text-sm text-gray-900 dark:text-gray-100">
                    {entry.displayName || entry.username}
                  </span>
                  <span className="text-sm font-semibold text-teal-600 dark:text-teal-300">
                    {entry.reputationPoints} pts
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Leaderboard;
