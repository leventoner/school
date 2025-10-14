import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../services/AuthService";
import { AxiosResponse } from "axios"; // Import AxiosResponse for type safety

// Define interfaces for props and types
interface RegisterProps {} // No props are passed to Register component

// Define the structure of the response from the register API
interface RegisterResponse {
  message: string;
}

const Register: React.FC<RegisterProps> = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null); // State for messages (success or error)
  const [successful, setSuccessful] = useState(false); // State to track if registration was successful

  const navigate = useNavigate(); // Hook to navigate programmatically

  const onChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    const username = e.target.value;
    setUsername(username);
  };

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setMessage(null); // Clear previous messages
    setLoading(true);
    setSuccessful(false);

    try {
      // Use the imported AxiosResponse type for the response
      const response: AxiosResponse<RegisterResponse> = await AuthService.register(username, email, password);
      setMessage(response.data.message);
      setSuccessful(true);
      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate('/login'); // Use navigate for programmatic navigation
      }, 2000); // Redirect after 2 seconds
    } catch (error: any) { // Catch any type for broader error handling
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      setMessage(resMessage);
      setSuccessful(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
                value={username}
                onChange={onChangeUsername}
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
                value={email}
                onChange={onChangeEmail}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={onChangePassword}
              />
            </div>
          </div>

          {message && (
            <div className={successful ? "rounded-md bg-green-50 p-4" : "rounded-md bg-red-50 p-4"}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {successful ? (
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM13.714 7.714a.75.75 0 00-1.055-1.055L6.75 11.757 5.374 10.373a.75.75 0 00-1.06 1.06l1.875 1.875a.75.75 0 001.06 0l3.875-3.875z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.286 7.286a.75.75 0 00-1.06 1.06L9.44 10l-2.154 2.154a.75.75 0 101.06 1.06L10.56 11.06l2.154 2.154a.75.75 0 101.06-1.06L11.614 10l2.154-2.154a.75.75 0 00-1.06-1.06L10.56 8.94 8.286 7.286z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              disabled={loading}
            >
              {loading && (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                </span>
              )}
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
