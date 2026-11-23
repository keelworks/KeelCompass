import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { Notification } from "../../utils/types";
import { getNotifications, markNotificationRead, deleteNotification, clearAllNotifications } from "../../utils/store";
import { getSocket } from "../../utils/socket";
import { NotificationRow } from "./NotificationsPanel";
import { NotificationRowSkeleton } from "../ui/Skeleton";

interface NotificationsFullViewProps {
  onBack: () => void;
}

// the dashboard's post list area, swapped out for the full notification
// history instead of the dropdown's capped-at-8 preview - reached via "View
// all notifications" in that dropdown
function NotificationsFullView({ onBack }: NotificationsFullViewProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [clearingAll, setClearingAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const fetched = await getNotifications();
        if (isMounted) setNotifications(fetched);
      } catch {
        if (isMounted) setNotifications([]);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const handleNotification = (notification: Notification) => setNotifications((prev) => [notification, ...prev]);
    const handleNotificationRemoved = ({ id }: { id: number }) =>
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    socket.on("notification", handleNotification);
    socket.on("notification:removed", handleNotificationRemoved);
    return () => {
      socket.off("notification", handleNotification);
      socket.off("notification:removed", handleNotificationRemoved);
    };
  }, []);

  const handleOpen = async (notification: Notification) => {
    if (!notification.read) {
      setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n)));
      markNotificationRead({ id: notification.id }).catch(() => {});
    }
    if (notification.target_url) navigate(notification.target_url);
  };

  const handleClearOne = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    deleteNotification(id).catch(() => {});
  };

  const handleClearAll = () => {
    if (notifications.length === 0) return;
    setClearingAll(true);
    clearAllNotifications().catch(() => {});
    setTimeout(() => {
      setNotifications([]);
      setClearingAll(false);
    }, 260);
  };

  return (
    <div className="shadow-md rounded-lg p-4 mb-6 bg-gray-50 dark:bg-gray-800 w-full h-full flex flex-col overflow-hidden animate-card-in">
      <div className="mb-4 flex-shrink-0 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-150"
        >
          <FiArrowLeft size={16} /> Back to posts
        </button>
        <h2 className="text-xl font-medium uppercase tracking-wide text-gray-900 dark:text-gray-100">Notifications</h2>
        {notifications.length > 0 ? (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 transition-colors duration-150"
          >
            Clear all
          </button>
        ) : (
          <span />
        )}
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 pr-1">
        {isLoading ? (
          <>
            <NotificationRowSkeleton />
            <NotificationRowSkeleton />
            <NotificationRowSkeleton />
          </>
        ) : notifications.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No notifications yet.</p>
        ) : (
          notifications.map((n) => (
            <div key={n.id} className="rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <NotificationRow
                notification={n}
                onOpen={handleOpen}
                onClear={handleClearOne}
                forceClearing={clearingAll}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationsFullView;
