import React, { useEffect, useState, useContext } from "react";
import ProjectCard from "../components/ProjectCard";
import { AuthContext } from "../contexts/AuthContext";
import { getAllProjects, getFacultyDashboard, endorseProject } from "../api";

const FacultyDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [facultyInfo, setFacultyInfo] = useState(null);

  // Fetch all projects
  useEffect(() => {
    if (token) {
      getAllProjects(token)
        .then((res) => {
          setProjects(res.data.data);
        })
        .catch((err) => {
          console.error("Error fetching projects:", err);
        });
    }
  }, [token]);

  // Fetch faculty info
  useEffect(() => {
    if (token && user?.id) {
      getFacultyDashboard(user.id, token)
        .then((res) => {
          setFacultyInfo(res.data.data);
        })
        .catch((err) => {
          console.error("Error fetching faculty info:", err);
        });
    }
  }, [token, user]);

  // Handle project endorsement
  const handleEndorse = async (projectId) => {
    try {
      const feedback = prompt("Enter feedback for this project:");
      if (!feedback) return;

      // Corrected API call: pass separate arguments
      const res = await endorseProject(user.id, projectId, feedback, token);

      alert("✅ Project endorsed successfully!");
      console.log("Endorsement response:", res.data);

      // Refresh projects to update endorsement info
      const refreshed = await getAllProjects(token);
      setProjects(refreshed.data.data);
    } catch (err) {
      console.error("Error endorsing project:", err);
      alert("❌ Failed to endorse project");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white py-12 px-6 shadow-lg">
        <h1 className="text-4xl font-bold mb-2">Faculty Dashboard 🎓</h1>
        <p className="text-lg opacity-90">
          {facultyInfo
            ? `Welcome, Prof. ${facultyInfo.name} (${facultyInfo.email})`
            : "Loading faculty info..."}
        </p>
      </div>

      {/* Projects */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          📝 Projects for Review
        </h2>

        {projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div
                key={project.id}
                className="transform hover:scale-[1.02] transition duration-200"
              >
                <ProjectCard
                  project={project}
                  userRole="FACULTY"
                  currentUserId={user?.id}
                  token={token}
                  onRequestCollaboration={null}
                  onDecideCollaboration={() => {}}
                  onEndorse={handleEndorse}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-20">
            <p className="text-xl">No projects available 📭</p>
            <p className="mt-2">
              Once students submit projects, they will appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacultyDashboard;
