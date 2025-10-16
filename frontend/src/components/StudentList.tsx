import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import { motion } from 'framer-motion';

import { Student } from '../types';

// Define interfaces for types used in the component
// interface User {
//   id: number;
//   username: string;
//   roles: string[];
// }

// interface AuthHeader {
//   Authorization: string;
// }

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

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold text-gray-800">Enrolled Students</h2>
        {canAddStudent && (
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link to="/add" className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 inline-block">
              Add Student
            </Link>
          </motion.div>
        )}
      </div>
      {isLoading && <p className="text-center text-gray-500">Loading students...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}
      {!isLoading && !error && students.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No students found.</p>
      )}
      {!isLoading && !error && students.length > 0 && (
        <div className="bg-white shadow-md rounded-lg">
          <motion.ul
            className="divide-y divide-gray-200"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {students.map(student => (
              <motion.li
                key={student.id}
                onClick={() => navigate(`/student/${student.id}`)}
                className="p-4 hover:bg-gray-50 cursor-pointer"
                variants={itemVariants}
                whileHover={{ backgroundColor: "#f9fafb", scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <p className="text-lg font-medium text-gray-900">{student.firstName} {student.lastName}</p>
                      <p className="text-sm text-gray-500">School Number: {student.schoolNumber}</p>
                    </div>
                  </div>
                </div>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      )}
    </motion.div>
  );
};

export default StudentList;
