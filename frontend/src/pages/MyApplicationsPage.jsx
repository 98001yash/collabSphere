// src/pages/MyApplicationsPage.jsx
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { getApplicationsForStudent } from "../api";

const MyApplicationsPage = () => {
  const { token } = useContext(AuthContext);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const res = await getApplicationsForStudent(token);
        setApplications(res.data || []);
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) return <p className="text-gray-500 text-center">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-purple-700 mb-6">My Applications</h1>

      {applications.length > 0 ? (
        <div className="grid gap-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="p-4 border rounded-lg shadow-sm bg-white"
            >
              <h2 className="text-lg font-semibold text-gray-800">
                {app.opportunityTitle}
              </h2>
              <p className="text-sm text-gray-600">
                Organization: {app.organization}
              </p>
              <p className="text-sm text-gray-600">
                Status:{" "}
                <span
                  className={`font-medium ${
                    app.status === "PENDING"
                      ? "text-yellow-600"
                      : app.status === "ACCEPTED"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {app.status}
                </span>
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">You have not applied to any opportunities yet.</p>
      )}
    </div>
  );
};

export default MyApplicationsPage;
