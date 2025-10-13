import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import StudentList from './components/StudentList';
import AddStudent from './components/AddStudent';
import UpdateStudent from './UpdateStudent';
import StudentDetail from './components/StudentDetail';
import Login from './components/Login';
import Register from './components/Register';
import AuthService from './services/AuthService';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  const [currentUser, setCurrentUser] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
    navigate("/login");
  };

  const login = (user) => {
    setCurrentUser(user);
  }

  return (
    <div className="bg-gray-50 min-h-screen text-gray-800 font-sans flex flex-col">
      <Header currentUser={currentUser} logOut={logOut} />
      <main className="container mx-auto p-8 flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/students" element={<StudentList />} />
          <Route path="/student/:id" element={<StudentDetail />} />
          
          {/* Protected Routes */}
          <Route element={<ProtectedRoute roles={['ROLE_ADMIN', 'ROLE_MODERATOR']} />}>
            <Route path="/add" element={<AddStudent />} />
            <Route path="/update/:id" element={<UpdateStudent />} />
          </Route>

          <Route path="/login" element={<Login onLogin={login} />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
