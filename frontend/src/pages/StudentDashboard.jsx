import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "../components/ProjectCard";
import { AuthContext } from "../contexts/AuthContext";
import {
  getAllProjects,
  getRequestsByStudent,
  getProjectsOfOwner,
  applyForCollaboration,
  getRequestsForProject,
  decideCollaborationRequest,
} from "../api";

const StudentDashboard = () => {
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [availableProjects, setAvailableProjects] = useState([]);
  const [yourProjects, setYourProjects] = useState([]);
  const [requestsByStudent, setRequestsByStudent] = useState([]);
  const [requestsMap, setRequestsMap] = useState({});

  useEffect(() => {
    if (token && user) {
      // Fetch all projects (excluding user's own)
      getAllProjects(token)
        .then((res) => {
          const projects = res.data.data;
          setAvailableProjects(projects.filter((p) => p.ownerId !== user.id));
        })
        .catch((err) => console.error("Error fetching all projects:", err));

      // Fetch user's own projects
      getProjectsOfOwner(user.id, token)
        .then((res) => {
          setYourProjects(res.data.data);

          res.data.data.forEach((project) => {
            getRequestsForProject(project.id, token)
              .then((res) => {
                setRequestsMap((prev) => ({
                  ...prev,
                  [project.id]: res.data.data,
                }));
              })
              .catch((err) => console.error(err));
          });
        })
        .catch((err) => console.error("Error fetching your projects:", err));

      // Fetch student's collaboration requests
      getRequestsByStudent(user.id, token)
        .then((res) => setRequestsByStudent(res.data.data))
        .catch((err) => console.error("Error fetching requests:", err));
    }
  }, [token, user]);

  const handleRequestCollaboration = async (projectId) => {
    try {
      await applyForCollaboration(user.id, projectId, token);
      setRequestsByStudent((prev) => [...prev, { projectId }]);
      setAvailableProjects((prev) =>
        prev.map((p) =>
          p.id === projectId ? { ...p, isContributor: true } : p
        )
      );
      alert("Collaboration request sent!");
    } catch (err) {
      console.error(err);
      alert("Failed to send collaboration request.");
    }
  };

  const handleDecision = async (requestId, projectId, decision) => {
    try {
      await decideCollaborationRequest(requestId, user.id, decision, token);
      alert(`Request ${decision}!`);
      setRequestsMap((prev) => ({
        ...prev,
        [projectId]: prev[projectId].map((r) =>
          r.id === requestId ? { ...r, status: decision } : r
        ),
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to update request.");
    }
  };

  const hasRequested = (projectId) =>
    requestsByStudent.some((r) => r.projectId === projectId);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 px-6 shadow-lg flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name} 👋</h1>
          <p className="text-lg opacity-90">
            Manage your projects, collaborate with peers, and explore new opportunities.
          </p>
        </div>
        {/* Create Project Button */}
        <button
  onClick={() => navigate("/student/create-project")}
  className="bg-white text-blue-600 px-4 py-2 rounded-lg font-semibold shadow hover:bg-gray-100"
>
  + Create Project
</button>

      </div>

      {/* Your Projects Section */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          📂 Your Projects
        </h2>
        {yourProjects.length > 0 ? (
          yourProjects.map((project) => (
            <div key={project.id} className="mb-6">
              <ProjectCard project={project} userRole="STUDENT" />
              {requestsMap[project.id]?.length > 0 && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg shadow-inner">
                  <h4 className="font-semibold text-gray-700 mb-1">
                    Collaboration Requests
                  </h4>
                  {requestsMap[project.id].map((req) => (
                    <div
                      key={req.id}
                      className="flex justify-between items-center mb-1 p-2 bg-white rounded shadow-sm"
                    >
                      <span>
                        {req.studentName} ({req.studentEmail}) -{" "}
                        <strong>{req.status}</strong>
                      </span>
                      {req.status === "PENDING" && (
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleDecision(req.id, project.id, "ACCEPTED")
                            }
                            className="px-2 py-1 bg-green-500 text-white rounded text-xs"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleDecision(req.id, project.id, "REJECTED")
                            }
                            className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 py-5">
            You have not created any projects yet.
          </p>
        )}
      </div>

      {/* Available Projects Section */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
          📂 Available Projects
        </h2>
        {availableProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {availableProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={{ ...project, isContributor: hasRequested(project.id) }}
                userRole="STUDENT"
                onRequestCollaboration={handleRequestCollaboration}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 py-5">
            No projects available for collaboration.
          </p>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;







// second way to show 

// import React, { useEffect, useState, useContext } from "react";
// import ProjectCard from "../components/ProjectCard";
// import { AuthContext } from "../contexts/AuthContext";
// import {
//   getAllProjects,
//   getRequestsByStudent,
//   applyForCollaboration,
//   getProjectsOfOwner,
//   getRequestsForProject,
//   decideCollaborationRequest,
// } from "../api";

// const StudentDashboard = () => {
//   const { user, token } = useContext(AuthContext);
//   const [projects, setProjects] = useState([]);
//   const [requests, setRequests] = useState([]);
//   const [ownerProjects, setOwnerProjects] = useState([]);
//   const [projectRequests, setProjectRequests] = useState({}); // map projectId -> requests[]

//   useEffect(() => {
//     if (token && user) {
//       // Fetch all projects
//       getAllProjects(token)
//         .then((res) => setProjects(res.data.data))
//         .catch((err) => console.error("Error fetching projects:", err));

//       // Fetch student's collaboration requests
//       getRequestsByStudent(user.id, token)
//         .then((res) => setRequests(res.data.data))
//         .catch((err) => console.error("Error fetching requests:", err));

//       // Fetch projects owned by this user
//       getProjectsOfOwner(user.id, token)
//         .then((res) => setOwnerProjects(res.data.data))
//         .catch((err) => console.error("Error fetching owner projects:", err));
//     }
//   }, [token, user]);

//   const handleRequestCollaboration = async (projectId) => {
//     try {
//       await applyForCollaboration(user.id, projectId, token);
//       setRequests((prev) => [...prev, { projectId }]);
//       setProjects((prev) =>
//         prev.map((p) =>
//           p.id === projectId ? { ...p, isContributor: true } : p
//         )
//       );
//       alert("Collaboration request sent!");
//     } catch (err) {
//       console.error("Error sending collaboration request:", err);
//       alert("Failed to send collaboration request. Try again.");
//     }
//   };

//   const handleDecision = async (requestId, projectId, status) => {
//     try {
//       await decideCollaborationRequest(requestId, user.id, status, token);
//       setProjectRequests((prev) => ({
//         ...prev,
//         [projectId]: prev[projectId].map((r) =>
//           r.id === requestId ? { ...r, status } : r
//         ),
//       }));
//       alert(`Request ${status.toLowerCase()}!`);
//     } catch (err) {
//       console.error("Error updating request:", err);
//       alert("Failed to update request.");
//     }
//   };

//   const loadRequestsForProject = async (projectId) => {
//     try {
//       const res = await getRequestsForProject(projectId, token);
//       setProjectRequests((prev) => ({ ...prev, [projectId]: res.data.data }));
//     } catch (err) {
//       console.error("Error fetching requests for project:", err);
//     }
//   };

//   const hasRequested = (projectId) =>
//     requests.some((r) => r.projectId === projectId);

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-12 px-6 shadow-lg">
//         <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name} 👋</h1>
//         <p className="text-lg opacity-90">
//           Manage your projects, collaborate with peers, and explore new opportunities.
//         </p>
//       </div>

//       <div className="max-w-7xl mx-auto px-6 py-10 space-y-12">
//         {/* Your Projects */}
//         <div>
//           <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//             🛠 Your Projects
//           </h2>
//           {ownerProjects.length > 0 ? (
//             ownerProjects.map((project) => (
//               <div
//                 key={project.id}
//                 className="bg-white shadow-md rounded-xl p-6 mb-6"
//               >
//                 <h3 className="text-lg font-bold mb-2">{project.title}</h3>
//                 <p className="text-sm text-gray-600 mb-4">
//                   {project.description}
//                 </p>
//                 <button
//                   onClick={() => loadRequestsForProject(project.id)}
//                   className="text-blue-600 hover:underline text-sm mb-3"
//                 >
//                   View Requests
//                 </button>

//                 {projectRequests[project.id] && (
//                   <div className="space-y-3">
//                     {projectRequests[project.id].map((req) => (
//                       <div
//                         key={req.id}
//                         className="flex items-center justify-between bg-gray-50 p-3 rounded-lg"
//                       >
//                         <div>
//                           <p className="font-medium">{req.studentName}</p>
//                           <p className="text-xs text-gray-500">
//                             {req.studentEmail}
//                           </p>
//                           <p className="text-xs">
//                             Status:{" "}
//                             <span className="font-semibold">{req.status}</span>
//                           </p>
//                         </div>
//                         {req.status === "PENDING" && (
//                           <div className="space-x-2">
//                             <button
//                               onClick={() =>
//                                 handleDecision(req.id, project.id, "ACCEPTED")
//                               }
//                               className="bg-green-500 text-white px-3 py-1 rounded-lg text-xs"
//                             >
//                               Approve
//                             </button>
//                             <button
//                               onClick={() =>
//                                 handleDecision(req.id, project.id, "REJECTED")
//                               }
//                               className="bg-red-500 text-white px-3 py-1 rounded-lg text-xs"
//                             >
//                               Reject
//                             </button>
//                           </div>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500">You haven’t created any projects yet.</p>
//           )}
//         </div>

//         {/* Available Projects */}
//         <div>
//           <h2 className="text-2xl font-semibold text-gray-800 mb-6">
//             📂 Available Projects
//           </h2>
//           {projects.length > 0 ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {projects.map((project) => (
//                 <ProjectCard
//                   key={project.id}
//                   project={{
//                     ...project,
//                     isContributor: hasRequested(project.id),
//                   }}
//                   userRole="STUDENT"
//                   onRequestCollaboration={handleRequestCollaboration}
//                 />
//               ))}
//             </div>
//           ) : (
//             <div className="text-center text-gray-500 py-20">
//               <p className="text-xl">No projects available. 🚀</p>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudentDashboard;
