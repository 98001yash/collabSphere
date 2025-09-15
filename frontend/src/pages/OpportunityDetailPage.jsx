import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getOpportunityById,
  applyToOpportunity,   // ✅ fixed name
  publishOpportunity,
  deleteOpportunity,
} from "../api";
import { AuthContext } from "../contexts/AuthContext";

const OpportunityDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useContext(AuthContext);

  const [opportunity, setOpportunity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getOpportunityById(id, token);
        setOpportunity(res.data);
      } catch (err) {
        console.error("Error fetching opportunity:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, token]);

  const handleApply = async () => {
    try {
      await applyToOpportunity({ opportunityId: id }, token); // ✅ send correct payload
      alert("✅ Application submitted!");
    } catch (err) {
      console.error("Error applying:", err);
      alert("❌ Failed to apply.");
    }
  };

  const handlePublish = async () => {
    try {
      await publishOpportunity(id, token);
      alert("✅ Opportunity published!");
      navigate("/opportunities");
    } catch (err) {
      console.error("Error publishing:", err);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("⚠️ Are you sure you want to delete this opportunity?")) return;
    try {
      await deleteOpportunity(id, token);
      alert("🗑️ Opportunity deleted.");
      navigate("/opportunities");
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  if (loading) return <p className="text-gray-500 text-center">Loading...</p>;
  if (!opportunity) return <p className="text-red-500 text-center">❌ Opportunity not found</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-purple-700 mb-4">{opportunity.title}</h1>
      <p className="text-gray-700 mb-6">{opportunity.description}</p>

      <div className="grid grid-cols-2 gap-4 text-sm mb-6">
        <p><strong>🏢 Organization:</strong> {opportunity.organization}</p>
        <p><strong>📍 Location:</strong> {opportunity.location}</p>
        <p><strong>💰 Stipend:</strong> {opportunity.stipendMin} - {opportunity.stipendMax}</p>
        <p><strong>📅 Deadline:</strong> {new Date(opportunity.applicationDeadline).toLocaleDateString()}</p>
        <p><strong>🎓 Type:</strong> {opportunity.type}</p>
        <p><strong>🖥 Mode:</strong> {opportunity.mode}</p>
      </div>

      <div className="flex gap-4 mt-6">
        {user?.role === "STUDENT" && (
          <button
            onClick={handleApply}
            className="bg-gradient-to-r from-green-500 to-blue-500 text-white px-6 py-2 rounded-lg hover:opacity-90 transition"
          >
            Apply Now
          </button>
        )}

        {["FACULTY", "ADMIN"].includes(user?.role) && (
          <>
            {opportunity.status !== "PUBLISHED" && (
              <button
                onClick={handlePublish}
                className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
              >
                Publish
              </button>
            )}
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default OpportunityDetailPage;
