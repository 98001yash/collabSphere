// src/pages/ManageOpportunitiesPage.jsx
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { getActiveOpportunities, deleteOpportunity } from "../api";
import { AuthContext } from "../contexts/AuthContext";

const ManageOpportunitiesPage = () => {
  const { user, token } = useContext(AuthContext);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) return;
      try {
        const res = await getActiveOpportunities(token);
        let data = res.data;

        // Students should only see published opportunities
        if (user?.role === "STUDENT") {
          data = data.filter((opp) => opp.published === true);
        }

        setOpportunities(data);
      } catch (err) {
        console.error("Error fetching opportunities:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, user]);

  const handleDelete = async (id) => {
    if (!window.confirm("⚠️ Delete this opportunity?")) return;
    try {
      await deleteOpportunity(id, token);
      setOpportunities((prev) => prev.filter((o) => o.id !== id));
      alert("🗑️ Opportunity deleted.");
    } catch (err) {
      console.error("Error deleting opportunity:", err);
      alert("❌ Failed to delete.");
    }
  };

  if (loading) return <p className="text-gray-500 text-center">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-purple-700">Manage Opportunities</h1>
        {(user?.role === "FACULTY" || user?.role === "ADMIN") && (
         <Link
         to="/opportunities/create"
         className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
>
        + Create Opportunity
</Link>

        )}
      </div>

      {opportunities.length > 0 ? (
        <div className="grid gap-4">
          {opportunities.map((opp) => (
            <div
              key={opp.id}
              className="p-4 border rounded-lg shadow-sm bg-white flex justify-between items-center"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800">{opp.title}</h2>
                <p className="text-sm text-gray-600">{opp.organization}</p>
              </div>

              <div className="flex gap-3">
                <Link
                  to={`/opportunities/${opp.id}`}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  View
                </Link>

                {user?.role === "ADMIN" && (
                  <button
                    onClick={() => handleDelete(opp.id)}
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No opportunities found.</p>
      )}
    </div>
  );
};

export default ManageOpportunitiesPage;
