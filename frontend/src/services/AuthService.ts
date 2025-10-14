import axios, { AxiosResponse, AxiosInstance } from "axios";

const API_URL = "http://localhost:8083/api/auth/";

// This interface represents the user data including the authentication token.
interface LoginResponse {
  username: string;
  token: string; // Changed from accessToken to token to match backend response
  tokenType: string;
  id?: number;
  roles?: string[];
}

// Define the structure for the Authorization header
interface AuthHeader {
  Authorization: string;
}

// Define function types for clarity and type safety
type RegisterFunction = (username: string, email: string, password: string) => Promise<AxiosResponse>;
type LoginFunction = (username: string, password: string) => Promise<LoginResponse>;
type LogoutFunction = () => void;
type GetCurrentUserFunction = () => LoginResponse | null;
type GetAuthHeaderFunction = () => AuthHeader;

// Create an Axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const userJson = localStorage.getItem("user");
    if (userJson) {
      try {
        const user = JSON.parse(userJson) as LoginResponse;
        // Use 'token' from localStorage, which corresponds to 'accessToken' in the backend response
        if (user && user.token) { 
          config.headers.Authorization = `Bearer ${user.token}`;
        } else {
          localStorage.removeItem("user");
        }
      } catch (e) {
        localStorage.removeItem("user");
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const register: RegisterFunction = (username, email, password) => {
  return apiClient.post("signup", { // Use apiClient instead of axios
    username,
    email,
    password,
  });
};

const login: LoginFunction = async (username, password) => {
  const response = await apiClient.post<LoginResponse>("signin", { // Use apiClient instead of axios
    username,
    password,
  });
  // Check for 'token' from the response data
  if (response.data && response.data.token) { 
    localStorage.setItem("user", JSON.stringify(response.data));
  } else {
    // Removed warning log
  }
  return response.data;
};

const logout: LogoutFunction = (): void => {
  localStorage.removeItem("user");
};

const getCurrentUser: GetCurrentUserFunction = (): LoginResponse | null => {
  const userJson = localStorage.getItem("user");
  if (userJson) {
    try {
      const user = JSON.parse(userJson);
      // Check for 'token' here as well
      if (user && user.username && user.token) { 
        return user as LoginResponse;
      } else {
        localStorage.removeItem("user");
        return null;
      }
    } catch (e) {
      localStorage.removeItem("user");
      return null;
    }
  }
  return null;
};

// getAuthHeader is no longer strictly necessary for direct use in API calls
// as the interceptor handles it, but can be kept for other potential uses.
const getAuthHeader: GetAuthHeaderFunction = (): AuthHeader => {
  const user = getCurrentUser();
  const header: AuthHeader = { Authorization: '' };
  // Use 'token' here
  if (user && user.token) { 
    header.Authorization = 'Bearer ' + user.token;
  }
  return header;
};

const AuthService: {
  register: RegisterFunction;
  login: LoginFunction;
  logout: LogoutFunction;
  getCurrentUser: GetCurrentUserFunction;
  getAuthHeader: GetAuthHeaderFunction; // Keep for potential other uses
  apiClient: AxiosInstance; // Export apiClient for other components if needed
} = {
  register,
  login,
  logout,
  getCurrentUser,
  getAuthHeader,
  apiClient, // Export apiClient
};

export default AuthService;
