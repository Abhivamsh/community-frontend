import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchPosts = () => api.get('/posts/');
export const fetchPostDetail = (id) => api.get(`/posts/${id}/`);
export const createPost = (data) => api.post('/posts/', data);
export const likePost = (id, userName) => api.post(`/posts/${id}/like/`, { user_name: userName });

export const createComment = (data) => api.post('/comments/', data);
export const likeComment = (id, userName) => api.post(`/comments/${id}/like/`, { user_name: userName });

export const fetchLeaderboard = () => api.get('/leaderboard/');

export default api;
