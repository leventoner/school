import axios from "axios";

const API_URL = "http://localhost:8083/api/auth/";

const register = (username, email, password) => {
  return axios.post(API_URL + "signup", {
    username,
    email,
    password,
  });
};

const login = (username, password) => {
  return axios.post(API_URL + "signin", {
    username,
    password,
  })
  .then((response) => {
    if (response.data.token) {
      localStorage.setItem("user", JSON.stringify(response.data));
    }
    return response.data;
  });
};

const logout = () => {
  localStorage.removeItem("user");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const getAuthHeader = () => {
  const user = getCurrentUser();
  const header = {};
  if (user && user.token) {
    header.Authorization = 'Bearer ' + user.token;
  }
  console.log('AuthService.getAuthHeader() returning:', header); // Log the header being returned
  return header;
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  getAuthHeader, // Add this method
};

export default AuthService;
