import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { getAllProjects, getEndorsementsByProject } from "../api";

const EndorsedProjects = () => {
  const { user, token } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [endorsementsMap, setEndorsementsMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;

    const fetchProjects = async () => {
      try {
        const res = await getAllProjects(token);
        setProjects(res.data.data || []);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };

    fetchProjects();
  }, [token]);

  useEffect(() => {
    if (!token || projects.length === 0) return;

    const fetchEndorsements = async () => {
      const map = {};
      for (const project of projects) {
        try {
          const res = await getEndorsementsByProject(project.id, token);
          map[project.id] = res.data.data || [];
        } catch (err) {
          console.error(
            `Error fetching endorsements for project ${project.id}:`,
            err
          );
          map[project.id] = [];
        }
      }
      setEndorsementsMap(map);
      setLoading(false);
    };

    fetchEndorsements();
  }, [projects, token]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-indigo-600 text-lg font-semibold animate-pulse">
        Loading endorsed projects...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-8">
      <h1 className="text-4xl font-extrabold mb-10 text-center text-indigo-700">
        🌟 All Endorsed Projects
      </h1>

      {projects.length === 0 ? (
        <p className="text-gray-600 text-center text-lg">
          No projects available
        </p>
      ) : (
        <div className="grid gap-8 md:grid-cols-2">
          {projects.map((project) => {
            const endorsements = endorsementsMap[project.id] || [];
            const facultyEndorsements = endorsements.filter(
              (e) => e.faculty?.id === user?.id
            );

            return (
              <div
                key={project.id}
                className="p-6 border rounded-2xl bg-white/90 shadow-lg hover:shadow-2xl transition relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>

                <h2 className="font-bold text-2xl mb-2 text-indigo-800">
                  {project.title}
                </h2>
                <p className="text-gray-700 mb-6">{project.description}</p>

                {/* Your Endorsements */}
                {facultyEndorsements.length > 0 ? (
                  <div className="mb-6">
                    <h3 className="font-semibold text-purple-700 mb-3 text-lg">
                      ✨ Your Endorsements
                    </h3>
                    <div className="space-y-3">
                      {facultyEndorsements.map((e) => (
                        <div
                          key={e.id}
                          className="p-4 bg-purple-50 border-l-4 border-purple-400 rounded-lg shadow-sm"
                        >
                          <p className="text-gray-800">{e.feedback}</p>
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(e.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 mb-6 italic">
                    You have not endorsed this project yet.
                  </p>
                )}

                {/* All Endorsements */}
                {endorsements.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-indigo-700 mb-3 text-lg">
                      📝 All Endorsements
                    </h3>
                    <div className="space-y-3">
                      {endorsements.map((e) => (
                        <div
                          key={e.id}
                          className="p-4 bg-indigo-50 border-l-4 border-indigo-400 rounded-lg shadow-sm"
                        >
                          <p className="font-medium text-indigo-800">
                            {e.faculty?.name || "Unknown Faculty"} (
                            {e.faculty?.email || "N/A"})
                          </p>
                          <p className="text-gray-700">{e.feedback}</p>
                          <p className="text-gray-500 text-xs mt-1">
                            {new Date(e.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EndorsedProjects;
