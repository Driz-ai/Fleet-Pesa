import {
  createContext,
  useContext,
  useMemo,
  useState,
} from "react";

import {
  MOCK_DRIVER_NOTIFICATIONS,
  MOCK_OWNER_NOTIFICATIONS,
} from "../data/mockNotifications.js";

const NotificationContext = createContext(null);

export function NotificationProvider({
  children,
  role = "owner",
}) {
  const normalizedRole = String(role).toLowerCase();

  const initialNotifications =
    normalizedRole === "driver"
      ? MOCK_DRIVER_NOTIFICATIONS
      : MOCK_OWNER_NOTIFICATIONS;

  const [notifications, setNotifications] = useState(
    initialNotifications
  );

  const unreadCount = useMemo(
    () =>
      notifications.filter(
        (notification) => !notification.is_read
      ).length,
    [notifications]
  );

  function markAsRead(id) {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? {
              ...notification,
              is_read: true,
              read: true,
            }
          : notification
      )
    );
  }

  function markAllAsRead() {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        is_read: true,
        read: true,
      }))
    );
  }

  function clearNotifications() {
    setNotifications([]);
  }

  const value = {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      "useNotifications must be used inside NotificationProvider"
    );
  }

  return context;
}