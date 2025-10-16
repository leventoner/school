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

// Define the LoginResponse interface for successful login, which includes tokens.
// This is the type returned by the login API call.
interface LoginResponse {
  id: number;
  username: string;
  roles: string[];
  token: string;
  tokenType: string;
}

// Define the type for the roles prop in ProtectedRoute
type AllowedRoles = string[];

const App = () => {
  // Type the currentUser state to hold the LoginResponse data.
  // AuthService.getCurrentUser() might return a partial object, so we need to be careful.
  const [currentUser, setCurrentUser] = useState<LoginResponse | undefined>(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const userFromService: any = AuthService.getCurrentUser();
    // Ensure the user object has the necessary properties before setting state.
    // We are checking for properties that are part of the LoginResponse interface.
    // If AuthService.getCurrentUser() returns a type that is not fully LoginResponse,
    // this check will prevent type errors.
    if (userFromService && typeof userFromService.id === 'number' && typeof userFromService.username === 'string' && Array.isArray(userFromService.roles) && typeof userFromService.token === 'string') {
      // Type assertion is safe here because we've checked for the presence and type of required properties
      setCurrentUser(userFromService as LoginResponse);
    } else {
      // If user data is incomplete or missing, clear current user
      AuthService.logout(); // Clear potentially stale data from localStorage
      setCurrentUser(undefined);
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
    <div className="min-h-screen text-gray-800 font-sans flex flex-col">
      {/* Pass currentUser to Header. Header expects LoginResponse type. */}
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
