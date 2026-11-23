import { useEffect, useState } from "react";
import { UserStats } from "../utils/types";
import { getMyStats } from "../utils/store";
import MainLayout from "../components/wrappers/MainLayout";
import { Skeleton } from "../components/ui/Skeleton";

const Stats = () => {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    getMyStats()
      .then(setStats)
      .catch(() => setStats(null));
  }, []);

  return (
    <MainLayout>
      <div className="col-span-1 lg:col-span-3">
        <div className="shadow-md rounded-lg p-6 bg-gray-50 dark:bg-gray-800">
          <h2 className="text-xl font-medium uppercase tracking-wide text-gray-900 dark:text-gray-100 mb-4">
            My Activity
          </h2>

          {!stats ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
              <Skeleton className="h-20" />
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.reputationPoints}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Reputation points</p>
                </div>
                <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.questionsAsked}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Questions asked</p>
                </div>
                <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
                  <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.commentsMade}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Comments made</p>
                </div>
              </div>

              <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-2">Badges</p>
              {stats.badges.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  No badges yet - ask a question, answer one, or get a few likes to earn your first.
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {stats.badges.map((badge) => (
                    <span
                      key={badge}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Stats;
