import { useEffect, useState, useContext } from "react";
import { getActiveOpportunities, applyToOpportunity } from "../api";
import { AuthContext } from "../contexts/AuthContext";
import OpportunityCard from "../components/OpportunityCard";

const OpportunityListPage = () => {
  const { token } = useContext(AuthContext);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getActiveOpportunities(token);
        // Ensure we add "applied" flag for UI purposes
        const ops = (res.data?.data || res.data || []).map((op) => ({
          ...op,
          applied: false,
        }));
        setOpportunities(ops);
      } catch (err) {
        console.error("Error fetching opportunities:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [token]);

  const handleApply = async (opportunityId) => {
    try {
      await applyToOpportunity({ opportunityId }, token);
      alert("✅ Applied successfully!");
      setOpportunities((prev) =>
        prev.map((op) =>
          op.id === opportunityId ? { ...op, applied: true } : op
        )
      );
    } catch (err) {
      console.error(err);
      alert("You have already applied to this opportunity.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">✨ Opportunities</h1>

      {loading ? (
        <p className="text-gray-500">Loading opportunities...</p>
      ) : opportunities.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {opportunities.map((op) => (
            <OpportunityCard
              key={op.id}
              opportunity={op}
              onApply={() => handleApply(op.id)}
            />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No active opportunities found.</p>
      )}
    </div>
  );
};

export default OpportunityListPage;
