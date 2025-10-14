import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

// Define interfaces for types used in the component
// interface User {
//   id: number;
//   username: string;
//   roles: string[];
// }

// interface AuthHeader {
//   Authorization: string;
// }

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  schoolNumber?: string | null;
  birthDate: string; // Assuming date is stored as string
  studentClass?: string | null;
  courses: string[];
  grades: { [key: string]: string }; // Assuming grades is an object with string keys and string values
}

const API_URL = 'http://localhost:8083/api/students';

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]); // Explicitly type students as an array of Student
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    setError(null); // Clear previous errors
    try {
      // Removed user check and auth header for public access to student list
      const response = await fetch(API_URL, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Student[] = await response.json(); // Expecting an array of students
      setStudents(data);
    } catch (e: any) { // Catch any type for broader error handling
      setError('Could not fetch students. Please check your connection.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []); // Removed navigate from dependencies as it's no longer used here

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  // Check if the current user has ADMIN or MODERATOR roles
  const currentUser = AuthService.getCurrentUser();
  // Safely access roles, defaulting to an empty array if currentUser or currentUser.roles is null/undefined
  const userRoles = currentUser?.roles ?? [];
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
        <p className="text-center text-gray-500 mt-8">No students found.</p>
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
