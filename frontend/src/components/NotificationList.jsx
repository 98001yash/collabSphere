// src/components/NotificationList.jsx
import { useEffect, useState, useContext } from "react";
import Notification from "./Notification";
import { AuthContext } from "../contexts/AuthContext";
import { getNotifications, markNotificationAsRead } from "../api";

const NotificationList = () => {
  const { user, token } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user || !token) return; // Guard if not logged in
      try {
        const res = await getNotifications(user.id, token);
        console.log("Notifications API response:", res.data); // Debug
        setNotifications(res.data.data || []); // Use the 'data' field
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
  }, [user, token]);

  const handleMarkAsRead = async (notificationId) => {
    if (!token) return;
    try {
      const res = await markNotificationAsRead(notificationId, token);
      if (res.status === 200) {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === notificationId ? { ...n, status: "READ" } : n
          )
        );
      }
    } catch (err) {
      console.error("Error marking notification as read:", err);
    }
  };

  if (!user) {
    return <p className="text-center text-red-500">⚠️ No user logged in. Please login first.</p>;
  }

  return (
    <div className="max-w-lg mx-auto mt-6">
      <h2 className="text-xl font-bold mb-4">Notifications</h2>
      {notifications.length > 0 ? (
        notifications.map((n) => (
          <Notification
            key={n.id}
            notification={n}
            onMarkAsRead={handleMarkAsRead}
          />
        ))
      ) : (
        <p className="text-gray-500">No notifications found.</p>
      )}
    </div>
  );
};

export default NotificationList;
