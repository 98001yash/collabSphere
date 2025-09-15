import axios from "axios";

const API_URL = "http://localhost:9090"; // backend base URL

// ---- Auth APIs ----
export const registerUser = async (userData) => {
  return await axios.post(`${API_URL}/api/auth/register`, userData, {
    withCredentials: true,
  });
};

export const loginUser = async (email, password) => {
  return await axios.post(
    `${API_URL}/api/auth/login`,
    { email, password },
    { withCredentials: true }
  );
};

// ---- Project APIs ----
export const createProject = async (ownerId, projectData, token) => {
  return await axios.post(
    `${API_URL}/api/projects/create/${ownerId}`,
    projectData,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

// Fetch all projects
export const getAllProjects = async (token) => {
  return await axios.get(`${API_URL}/api/projects`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ---- Collaboration APIs ----

// Send a collaboration request
export const applyForCollaboration = async (studentId, projectId, token) => {
  return await axios.post(
    `${API_URL}/api/collaborations/apply`,
    { studentId, projectId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

// Decide on a collaboration request (Approve/Reject)
export const decideCollaborationRequest = async (requestId, ownerId, status, token) => {
  return await axios.put(
    `${API_URL}/api/collaborations/${requestId}/decide?ownerId=${ownerId}`,
    { status }, // CollaborationDecisionDto only has status
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};

// Optional: Get requests for a project (for owner)
export const getRequestsForProject = async (projectId, token) => {
  return await axios.get(`${API_URL}/api/collaborations/project/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Optional: Get requests made by a student
export const getRequestsByStudent = async (studentId, token) => {
  return await axios.get(`${API_URL}/api/collaborations/student/${studentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};


// Fetch all projects created by a specific owner (student)
export const getProjectsOfOwner = async (ownerId, token) => {
  return await axios.get(`${API_URL}/api/projects/owner/${ownerId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};



export const getFacultyDashboard = async (facultyId, token) => {
  return await axios.get(`${API_URL}/api/users/faculty/${facultyId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};



// ---- Endorsement APIs ----

// Faculty endorses a project
export const endorseProject = async (facultyId, projectId, feedback, token) => {
  return await axios.post(
    `${API_URL}/api/endorsements`,
    { facultyId, projectId, feedback },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};



// Get all endorsements of a project
export const getEndorsementsByProject = async (projectId, token) => {
  return await axios.get(`${API_URL}/api/endorsements/project/${projectId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Revoke an endorsement (faculty/admin only)
export const revokeEndorsement = async (endorsementId, token) => {
  return await axios.put(
    `${API_URL}/api/endorsements/${endorsementId}/revoke`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};



// ---- Notification APIs ----
export const getNotifications = async (userId, token) => {
  return await axios.get(`${API_URL}/api/notifications/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const markNotificationAsRead = async (notificationId, token) => {
  return await axios.put(
    `${API_URL}/api/notifications/${notificationId}/read`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
};



// ---------------- Opportunities ----------------
export const getActiveOpportunities = async (token) =>
  await axios.get(`${API_URL}/api/opportunities/active`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getOpportunityById = async (id, token) =>
  await axios.get(`${API_URL}/api/opportunities/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const createOpportunity = async (data, token) =>
  await axios.post(`${API_URL}/api/opportunities`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const publishOpportunity = async (id, token) =>
  await axios.put(`${API_URL}/api/opportunities/${id}/publish`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteOpportunity = async (id, token) =>
  await axios.delete(`${API_URL}/api/opportunities/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// ---------------- Applications ----------------
export const applyToOpportunity = async (data, token) =>
  await axios.post(`${API_URL}/api/applications`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getApplicationsForOpportunity = async (id, token) =>
  await axios.get(`${API_URL}/api/applications/opportunity/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getApplicationsForStudent = async (token) =>
  await axios.get(`${API_URL}/api/applications/student`, {
    headers: { Authorization: `Bearer ${token}` },
  });




export const getUserProfile = async (token) =>
  await axios.get(`${API_URL}/api/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
