import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api', // your backend URL
});

export const loginUser = (email, password) => API.post('/auth/login', { email, password });
export const registerUser = (data) => API.post('/auth/register', data);

export const getProjects = (token) => API.get('/projects', {
  headers: { Authorization: `Bearer ${token}` }
});

export const requestCollaboration = (projectId, token) => API.post(`/projects/${projectId}/contributors`, {}, {
  headers: { Authorization: `Bearer ${token}` }
});
