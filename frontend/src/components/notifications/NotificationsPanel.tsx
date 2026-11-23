import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdNotificationsNone, MdClose } from "react-icons/md";
import { FiBell } from "react-icons/fi";
import { Notification } from "../../utils/types";
import { getNotifications, markNotificationRead, deleteNotification, clearAllNotifications } from "../../utils/store";
import { getSocket } from "../../utils/socket";
import { formatDate } from "../../utils/format";
import EmptyState from "../ui/EmptyState";

const SWIPE_DISMISS_THRESHOLD = 70;

interface NotificationRowProps {
  notification: Notification;
  onOpen: (n: Notification) => void;
  onClear: (id: number) => void;
  forceClearing: boolean;
}

// one notification row - tap to open, click the x to clear with a swipe-right
// animation, or (touch devices) press and drag left/right past the threshold
// to dismiss the same way
export function NotificationRow({ notification, onOpen, onClear, forceClearing }: NotificationRowProps) {
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [clearing, setClearing] = useState(false);
  const startXRef = useRef<number | null>(null);

  const triggerClear = (direction: 1 | -1 = 1) => {
    setClearing(true);
    setDragX(direction * 360);
  };

  useEffect(() => {
    if (!forceClearing) return;
    triggerClear(1);
  }, [forceClearing]);

  useEffect(() => {
    if (!clearing) return;
    const timer = setTimeout(() => onClear(notification.id), 220);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clearing]);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (clearing) return;
    startXRef.current = e.clientX;
    setDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (startXRef.current === null) return;
    setDragX(e.clientX - startXRef.current);
  };

  const endDrag = () => {
    if (startXRef.current === null) return;
    startXRef.current = null;
    setDragging(false);
    if (Math.abs(dragX) > SWIPE_DISMISS_THRESHOLD) {
      triggerClear(dragX > 0 ? 1 : -1);
    } else {
      setDragX(0);
    }
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      style={{
        transform: `translateX(${dragX}px)`,
        opacity: clearing ? 0 : 1 - Math.min(Math.abs(dragX) / 320, 0.7),
        transition: dragging ? "none" : "transform 0.22s ease-out, opacity 0.22s ease-out",
        touchAction: "pan-y",
      }}
      className={`relative border-b border-gray-100 dark:border-gray-700 last:border-b-0 ${
        !notification.read ? "bg-brand-50 dark:bg-teal-900/20" : "bg-white dark:bg-gray-800"
      }`}
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() => onOpen(notification)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onOpen(notification);
        }}
        className="w-full text-left px-4 py-3 pr-9 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-100"
      >
        <p className="text-sm text-gray-800 dark:text-gray-100">{notification.message}</p>
        <p className="text-xs text-gray-400 mt-1">{formatDate(notification.created_at)}</p>
      </div>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          triggerClear(1);
        }}
        aria-label="Clear notification"
        className="absolute top-3 right-3 text-gray-300 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 transition-colors duration-150"
      >
        <MdClose size={16} />
      </button>
    </div>
  );
}

function NotificationsPanel() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const [clearingAll, setClearingAll] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const fetched = await getNotifications();
        if (isMounted) setNotifications(fetched);
      } catch {
        if (isMounted) setNotifications([]);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleNotification = (notification: Notification) => {
      setNotifications((prev) => [notification, ...prev]);
    };

    // the backend removes a notification when the thing that caused it is
    // undone (an unlike, a deleted comment, a deleted post) so people aren't
    // flooded with stale entries - mirror that removal live instead of
    // waiting on a refetch
    const handleNotificationRemoved = ({ id }: { id: number }) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    socket.on("notification", handleNotification);
    socket.on("notification:removed", handleNotificationRemoved);
    return () => {
      socket.off("notification", handleNotification);
      socket.off("notification:removed", handleNotificationRemoved);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  const handleNotificationClick = async (notification: Notification) => {
    if (!notification.read) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
      );
      try {
        await markNotificationRead({ id: notification.id });
      } catch {
        // keep optimistic local state even if the mark-read call fails
      }
    }
    setOpen(false);
    if (notification.target_url) navigate(notification.target_url);
  };

  const handleClearOne = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    deleteNotification(id).catch(() => {
      // nothing to roll back to usefully here - a stray server-side
      // notification left behind isn't worth re-inserting a cleared row
    });
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
    <div className="relative" ref={panelRef}>
      <button
        onClick={() => setOpen((s) => !s)}
        aria-label="Notifications"
        className="flex items-center justify-center -m-2 p-2 rounded-full text-gray-700 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white transition-all duration-200 active:scale-90"
      >
        <span className="relative inline-flex">
          <MdNotificationsNone size={20} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-yellow-400 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce-in">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-8 w-80 max-h-96 overflow-y-auto z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-md origin-top-right animate-dropdown-in">
          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800">
            <span className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Notifications
            </span>
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={handleClearAll}
                className="text-xs font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 transition-colors duration-150"
              >
                Clear all
              </button>
            )}
          </div>
          {notifications.length === 0 ? (
            <EmptyState icon={FiBell} title="No notifications yet" compact />
          ) : (
            notifications.slice(0, 8).map((n) => (
              <NotificationRow
                key={n.id}
                notification={n}
                onOpen={handleNotificationClick}
                onClear={handleClearOne}
                forceClearing={clearingAll}
              />
            ))
          )}
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              navigate("/dashboard", { state: { showAllNotifications: true } });
            }}
            className="w-full text-center text-xs font-semibold uppercase tracking-wide text-teal-600 hover:text-teal-700 dark:text-teal-400 dark:hover:text-teal-300 py-2.5 border-t border-gray-100 dark:border-gray-700 sticky bottom-0 bg-white dark:bg-gray-800 transition-colors duration-150"
          >
            View all notifications
          </button>
        </div>
      )}
    </div>
  );
}

export default NotificationsPanel;
