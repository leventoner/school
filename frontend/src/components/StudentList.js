import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService'; // Import AuthService

const API_URL = 'http://localhost:8083/api/students';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const user = AuthService.getCurrentUser();
      if (!user) {
        // If no user is logged in, redirect to login page
        navigate('/login');
        return;
      }

      const response = await fetch(API_URL, {
        headers: {
          'Authorization': AuthService.getAuthHeader().Authorization, // Use JWT token
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401 || response.status === 403) {
        // If unauthorized or forbidden, clear user data and redirect to login
        AuthService.logout();
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStudents(data);
    } catch (e) {
      setError('Could not fetch students. Please check your connection or login status.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [navigate]); // Include navigate in dependencies

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Check if the current user has ADMIN or MODERATOR roles
  const currentUser = AuthService.getCurrentUser();
  const userRoles = currentUser ? currentUser.roles : [];
  const canAddStudent = userRoles.includes('ROLE_ADMIN') || userRoles.includes('ROLE_MODERATOR');

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Enrolled Students</h2>
        {canAddStudent && ( // Conditionally render the "Add Student" button
          <Link to="/add" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
            Add Student
          </Link>
        )}
      </div>
      {isLoading && <p className="text-center text-gray-500">Loading students...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!isLoading && !error && students.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No students found. Add one!</p>
      )}
      {!isLoading && !error && students.length > 0 && (
        <div className="bg-white shadow-md rounded-lg">
          <ul className="divide-y divide-gray-200">
            {students.map(student => (
              <li key={student.id} onClick={() => navigate(`/student/${student.id}`)} className="p-4 hover:bg-gray-50 cursor-pointer transition duration-300">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <p className="text-lg font-medium text-gray-900">{student.firstName} {student.lastName}</p>
                      <p className="text-sm text-gray-500">School Number: {student.schoolNumber}</p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StudentList;
