// src/components/Notification.jsx
import { Bell, CheckCircle } from "lucide-react";

const Notification = ({ notification, onMarkAsRead }) => {
  const { id, type, message, createdAt, status } = notification;
  const isRead = status === "READ";

  const typeColors = {
    INFO: "border-blue-500",
    WARNING: "border-yellow-500",
    ERROR: "border-red-500",
    PROJECT_ENDORSED: "border-green-500",
    ENDORSEMENT_REVOKED: "border-orange-500",
    NEW_COLLAB_REQUEST: "border-purple-500",
    COLLAB_REQUEST_ACCEPTED: "border-teal-500",
  };

  return (
    <div
      className={`p-4 rounded-xl shadow-md mb-3 flex justify-between items-center transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl
        ${isRead ? "bg-gray-100" : "bg-white"} border-l-4 ${typeColors[type] || "border-gray-400"}`}
    >
      <div className="flex items-start gap-3">
        {isRead ? (
          <CheckCircle size={22} className="text-green-500 mt-0.5" />
        ) : (
          <Bell size={22} className="text-blue-500 mt-0.5 animate-bounce" />
        )}
        <div>
          <p className={`text-sm font-medium ${isRead ? "text-gray-500" : "text-gray-800"}`}>{message}</p>
          <span className="text-xs text-gray-400">{new Date(createdAt).toLocaleString()}</span>
        </div>
      </div>
      {!isRead && (
        <button onClick={() => onMarkAsRead(id)} className="text-blue-600 hover:underline text-sm font-semibold">
          Mark as Read
        </button>
      )}
    </div>
  );
};

export default Notification;
