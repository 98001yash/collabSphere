import React, { useContext, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { HiMenu, HiX } from "react-icons/hi";
import { Bell, CheckCircle } from "lucide-react";
import { getNotifications, markNotificationAsRead } from "../api";

const Navbar = () => {
  const { user, token, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notifOpen, setNotifOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Fetch notifications
  useEffect(() => {
    if (!user || !token) return;
    const fetchNotifications = async () => {
      try {
        const res = await getNotifications(user.id, token);
        setNotifications(res.data.data || []);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setNotifications([]);
      }
    };
    fetchNotifications();
  }, [user, token]);

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id, token);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, status: "READ" } : n))
      );
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const unreadCount = Array.isArray(notifications)
    ? notifications.filter((n) => n.status === "UNREAD").length
    : 0;

  return (
    <nav className="bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0 font-bold text-2xl tracking-wide">
            <Link to="/" className="hover:text-gray-200 transition-colors duration-300">
              CollabSphere
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex space-x-6 items-center">
            {user && (
              <>
                {user.role === "STUDENT" && (
                  <>
                    <Link className="hover:text-gray-200 transition-colors" to="/student">
                      Dashboard
                    </Link>
                    <Link className="hover:text-gray-200 transition-colors" to="/opportunities">
                      Opportunities
                    </Link>
                  </>
                )}
                {user.role === "FACULTY" && (
                  <>
                    <Link className="hover:text-gray-200 transition-colors" to="/faculty">
                      Dashboard
                    </Link>
                    <Link className="hover:text-gray-200 transition-colors" to="/faculty/endorsed-projects">
                      Endorsed Projects
                    </Link>
                    <Link className="hover:text-gray-200 transition-colors" to="/opportunities/manage">
                      Manage Opportunities
                    </Link>
                  </>
                )}
                {user.role === "ADMIN" && (
                  <>
                    <Link className="hover:text-gray-200 transition-colors" to="/admin">
                      Admin Panel
                    </Link>
                    <Link className="hover:text-gray-200 transition-colors" to="/opportunities/manage">
                      Manage Opportunities
                    </Link>
                  </>
                )}

                <Link className="hover:text-gray-200 transition-colors" to="/profile">
                  Profile
                </Link>

                {/* Notifications */}
                <div className="relative">
                  <button className="relative" onClick={() => setNotifOpen(!notifOpen)}>
                    <Bell size={24} />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white text-black rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                      {notifications.length > 0 ? (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            className={`p-3 flex justify-between items-start border-b ${
                              n.status === "UNREAD" ? "bg-gray-100" : "bg-white"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {n.status === "READ" ? (
                                <CheckCircle size={20} className="text-green-500 mt-0.5" />
                              ) : (
                                <Bell size={20} className="text-blue-500 mt-0.5" />
                              )}
                              <div>
                                <p className="text-sm">{n.message}</p>
                                <span className="text-xs text-gray-500">
                                  {new Date(n.createdAt).toLocaleString()}
                                </span>
                              </div>
                            </div>
                            {n.status === "UNREAD" && (
                              <button
                                className="text-blue-600 hover:underline text-xs ml-2"
                                onClick={() => handleMarkAsRead(n.id)}
                              >
                                Mark as Read
                              </button>
                            )}
                          </div>
                        ))
                      ) : (
                        <p className="p-3 text-gray-500">No notifications</p>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleLogout}
                  className="bg-white text-purple-600 font-semibold px-4 py-1 rounded-full hover:bg-gray-100 transition transform hover:scale-105"
                >
                  Logout
                </button>
              </>
            )}

            {!user && (
              <>
                <Link className="hover:text-gray-200 transition-colors" to="/login">
                  Login
                </Link>
                <Link
                  className="bg-white text-purple-600 px-4 py-1 rounded-full font-semibold hover:bg-gray-100 transition transform hover:scale-105"
                  to="/register"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <HiX size={28} /> : <HiMenu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-gradient-to-r from-purple-500 to-pink-400 text-white px-6 py-6 space-y-3 rounded-b-lg shadow-lg animate-fadeIn">
          {user && (
            <>
              {user.role === "STUDENT" && (
                <>
                  <Link className="block hover:text-gray-200" to="/student" onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link className="block hover:text-gray-200" to="/opportunities" onClick={() => setMenuOpen(false)}>
                    Opportunities
                  </Link>
                </>
              )}
              {user.role === "FACULTY" && (
                <>
                  <Link className="block hover:text-gray-200" to="/faculty" onClick={() => setMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link className="block hover:text-gray-200" to="/faculty/endorsed-projects" onClick={() => setMenuOpen(false)}>
                    Endorsed Projects
                  </Link>
                  <Link className="block hover:text-gray-200" to="/opportunities/manage" onClick={() => setMenuOpen(false)}>
                    Manage Opportunities
                  </Link>
                </>
              )}
              {user.role === "ADMIN" && (
                <>
                  <Link className="block hover:text-gray-200" to="/admin" onClick={() => setMenuOpen(false)}>
                    Admin Panel
                  </Link>
                  <Link className="block hover:text-gray-200" to="/opportunities/manage" onClick={() => setMenuOpen(false)}>
                    Manage Opportunities
                  </Link>
                </>
              )}
              <Link className="block hover:text-gray-200" to="/profile" onClick={() => setMenuOpen(false)}>
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="w-full bg-white text-purple-600 font-semibold px-3 py-2 rounded-full hover:bg-gray-100 transition transform hover:scale-105"
              >
                Logout
              </button>
            </>
          )}

          {!user && (
            <>
              <Link className="block hover:text-gray-200" to="/login" onClick={() => setMenuOpen(false)}>
                Login
              </Link>
              <Link
                className="block bg-white text-purple-600 font-semibold px-3 py-2 rounded-full hover:bg-gray-100 transition transform hover:scale-105"
                to="/register"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
