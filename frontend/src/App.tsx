import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import StudentList from './components/StudentList';
import AddStudent from './components/AddStudent';
import UpdateStudent from './components/UpdateStudent';
import StudentDetail from './components/StudentDetail';
import Login from './components/Login';
import Register from './components/Register';
import AuthService from './services/AuthService';
import ProtectedRoute from './components/ProtectedRoute';

// Define the User interface based on what AuthService.getCurrentUser() returns.
// This interface represents the user data without authentication tokens.
interface User {
  id: number; // Assuming id is a number based on previous errors
  username: string;
  roles: string[]; // e.g., ['ROLE_USER', 'ROLE_ADMIN']
}

// Define the LoginResponse interface for successful login, which includes tokens.
// This is the type returned by the login API call.
interface LoginResponse {
  id: number;
  username: string;
  roles: string[];
  accessToken: string;
  tokenType: string;
}

// Define the type for the roles prop in ProtectedRoute
type AllowedRoles = string[];

const App = () => {
  // Type the currentUser state to hold the User data from AuthService.getCurrentUser().
  // If AuthService.getCurrentUser() returns tokens, this state should be LoginResponse.
  // Based on the error, it seems AuthService.getCurrentUser() returns User data only.
  const [currentUser, setCurrentUser] = useState<LoginResponse | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      // Set the currentUser state with the full user object from local storage
      setCurrentUser(user as LoginResponse);
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
    navigate("/login");
  };

  // Type the parameter for the login function to accept LoginResponse
  const login = (userData: LoginResponse) => {
    // Set the currentUser state with the full user object, including the token
    setCurrentUser(userData);
  }

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 font-sans flex flex-col">
      {/* Pass currentUser to Header. Header expects User type. */}
      <Header currentUser={currentUser} logOut={logOut} />
      <main className="container mx-auto p-8 flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/student/:id" element={<StudentDetail />} />
          
          {/* Protected Routes */}
          {/* Assuming ProtectedRoute expects roles as a prop of type AllowedRoles */}
          <Route element={<ProtectedRoute roles={['ROLE_ADMIN', 'ROLE_MODERATOR'] as AllowedRoles} />}>
            <Route path="/add" element={<AddStudent />} />
            <Route path="/update/:id" element={<UpdateStudent />} />
          </Route>

          {/* Assuming Login component expects onLogin prop of type LoginResponse */}
          <Route path="/login" element={<Login onLogin={login} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
