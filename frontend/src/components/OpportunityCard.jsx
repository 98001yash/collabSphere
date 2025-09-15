import { Link } from "react-router-dom";

const OpportunityCard = ({ opportunity, onApply }) => {
  const isApplied = opportunity.applied; // flag from backend or frontend state

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-lg transition duration-200 p-6 border border-gray-100">
      {/* Title */}
      <h2 className="text-xl font-semibold text-purple-700 mb-2">
        {opportunity.title}
      </h2>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-3 line-clamp-3">
        {opportunity.description}
      </p>

      {/* Tags */}
      <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
        <span className="px-3 py-1 bg-purple-100 text-purple-600 rounded-full font-medium">
          {opportunity.type}
        </span>
        <span className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full font-medium">
          {opportunity.mode}
        </span>
      </div>

      {/* Extra info */}
      <div className="text-sm text-gray-500 mb-3">
        <p>🏢 {opportunity.organization}</p>
        <p>
          💰 {opportunity.stipendMin} - {opportunity.stipendMax}
        </p>
        <p>
          📅 Apply before{" "}
          {new Date(opportunity.applicationDeadline).toLocaleDateString()}
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {/* View Details */}
        <Link
          to={`/opportunities/${opportunity.id}`}
          className="flex-1 bg-gradient-to-r from-purple-600 to-blue-500 text-white text-center py-2 rounded-lg font-medium hover:opacity-90 transform hover:scale-105 transition"
        >
          View Details
        </Link>

        {/* Apply Button */}
        {onApply && (
          <button
            onClick={onApply}
            disabled={isApplied}
            className={`flex-1 py-2 rounded-lg font-medium transition ${
              isApplied
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {isApplied ? "Applied" : "Apply"}
          </button>
        )}
      </div>
    </div>
  );
};

export default OpportunityCard;
