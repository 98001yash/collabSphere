import React, { useEffect, useState } from "react";
import { getEndorsementsByProject } from "../api"; // ✅ import your API call

const ProjectCard = ({
  project,
  onRequestCollaboration,
  onDecideCollaboration,
  onEndorse, // endorsement handler
  userRole,
  currentUserId,
  token, // ✅ pass token from parent
}) => {
  const isOwner = project.ownerId === currentUserId;
  const [endorsements, setEndorsements] = useState([]);

  // Fetch endorsements for this project
  useEffect(() => {
    if (project.id && token) {
      getEndorsementsByProject(project.id, token)
        .then((res) => setEndorsements(res.data))
        .catch((err) => console.error("Error fetching endorsements:", err));
    }
  }, [project.id, token]);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transform hover:scale-[1.03] transition duration-300">
      {/* Header with gradient */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-4 text-white">
        <h3 className="text-xl font-bold truncate">{project.title}</h3>
        <p className="text-sm opacity-90 truncate">{project.ownerName}</p>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col gap-3">
        <p className="text-gray-700 text-sm line-clamp-3">{project.description}</p>

        {project.repoUrl && (
          <a
            href={project.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 font-medium hover:underline text-sm truncate"
          >
            🔗 Repository
          </a>
        )}

        <div className="flex items-center justify-between mt-2">
          {/* Status Badge */}
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${
              project.status === "PENDING"
                ? "bg-yellow-100 text-yellow-800"
                : project.status === "APPROVED"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {project.status}
          </span>

          {/* Collaboration Button for non-owner students */}
          {!isOwner && userRole === "STUDENT" && (
            <>
              {project.isContributor ? (
                <span className="text-green-600 font-semibold text-xs">
                  Requested
                </span>
              ) : (
                onRequestCollaboration && (
                  <button
                    onClick={() => onRequestCollaboration(project.id)}
                    className="text-white bg-gradient-to-r from-purple-600 to-blue-500 px-3 py-1 rounded-lg text-xs hover:opacity-90 transition"
                  >
                    Request Collaboration
                  </button>
                )
              )}
            </>
          )}

          {/* Endorse button for faculty only */}
          {userRole === "FACULTY" && onEndorse && (
            <button
              onClick={() => onEndorse(project.id)}
              className="ml-2 text-white bg-blue-500 px-3 py-1 rounded-lg text-xs hover:bg-blue-600 transition"
            >
              Endorse
            </button>
          )}
        </div>

        {/* Collaboration requests for project owner */}
        {isOwner && project.collaborationRequests?.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">
              Collaboration Requests:
            </h4>
            <div className="flex flex-col gap-2">
              {project.collaborationRequests.map((req) => (
                <div
                  key={req.id}
                  className="flex items-center justify-between bg-gray-100 p-2 rounded-lg text-sm"
                >
                  <span>{req.studentName}</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => onDecideCollaboration(req.id, "APPROVED")}
                      className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:opacity-90 transition"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => onDecideCollaboration(req.id, "REJECTED")}
                      className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:opacity-90 transition"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ✅ Endorsements list */}
        {endorsements.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-semibold mb-2">Faculty Endorsements:</h4>
            <div className="flex flex-col gap-2">
              {endorsements.map((e) => (
                <div
                  key={e.id}
                  className="bg-gray-100 p-2 rounded-lg text-sm"
                >
                  <p className="font-medium text-gray-800">
                    👨‍🏫 {e.facultyName || "Faculty"}
                  </p>
                  <p className="text-gray-600 text-xs italic">
                    “{e.feedback || "No feedback"}”
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optional location */}
        {project.latitude && project.longitude && (
          <p className="text-gray-400 text-xs mt-1">
            📍 {project.latitude.toFixed(3)}, {project.longitude.toFixed(3)}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
