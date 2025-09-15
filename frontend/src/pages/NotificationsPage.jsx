// src/pages/NotificationsPage.jsx
import { useContext } from "react";
import NotificationList from "../components/NotificationList";
import { AuthContext } from "../contexts/AuthContext";

const NotificationsPage = () => {
  const { user } = useContext(AuthContext);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        ⚠️ No user logged in. Please login first.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="text-2xl font-bold mb-6">My Notifications</h1>
      <NotificationList userId={user.id} />
    </div>
  );
};

export default NotificationsPage;
