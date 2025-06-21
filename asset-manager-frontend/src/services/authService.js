// src/services/authService.js

import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth';

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/register`, userData);
  return response.data;
};

export const loginUser = async (data) => {
  const response = await axios.post(`${API_URL}/login`, data);
  return response.data;
};
