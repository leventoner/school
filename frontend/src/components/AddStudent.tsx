import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import { motion } from 'framer-motion';

// Define interfaces for types used in the component

interface AuthHeader {
  Authorization: string;
}

interface Grades {
  [key: string]: string;
}

// Interface for the data sent to the API when adding a student
interface NewStudentData {
  firstName: string;
  lastName: string;
  schoolNumber?: string | null;
  birthDate: string;
  studentClass?: string | null;
  courses: string[];
  grades: Grades;
}

const API_URL = 'http://localhost:8083/api/students';

const AddStudent: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [schoolNumber, setSchoolNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [courses, setCourses] = useState('');
  const [grades, setGrades] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  // Check if the current user has ADMIN or MODERATOR roles
  const currentUser = AuthService.getCurrentUser();
  const userRoles = currentUser?.roles ?? [];
  const canAddStudent = userRoles.includes('ROLE_ADMIN') || userRoles.includes('ROLE_MODERATOR');

  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // If the user doesn't have the required role, prevent submission
    if (!canAddStudent) {
      setError('You do not have permission to add students.');
      return;
    }

    // Basic validation for required fields
    if (!firstName || !lastName || !schoolNumber || !birthDate || !courses) {
      setError('Please fill in all required fields.'); // Use setError for consistency
      return;
    }

    const coursesArray: string[] = courses.split(',').map(course => course.trim()).filter(Boolean); // Filter out empty strings
    const gradesObject: Grades = grades.split(',').reduce((acc: Grades, grade) => {
      const [key, value] = grade.split(':');
      if (key && value) {
        acc[key.trim()] = value.trim();
      }
      return acc;
    }, {});

    const newStudentData: NewStudentData = {
      firstName,
      lastName,
      schoolNumber: schoolNumber || null, // Send null if empty, assuming backend handles it
      birthDate,
      studentClass: studentClass || null, // Send null if empty
      courses: coursesArray,
      grades: gradesObject
    };

    try {
      const authHeader: AuthHeader = AuthService.getAuthHeader();
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader.Authorization // Use JWT token
        },
        body: JSON.stringify(newStudentData)
      });

      if (response.ok) {
        navigate('/students'); // Redirect to student list after successful addition
      } else if (response.status === 403) {
        setError('You do not have permission to add students.');
      } else {
        // Attempt to parse error message from backend if available
        let errorMessage = 'Failed to add student';
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
            // Ignore if error response is not JSON
        }
        setError(errorMessage);
        console.error(`Add student failed: ${response.status}`);
      }
    } catch (e: any) {
      setError('Could not add student. Please check your connection or login status.');
      console.error(e);
    }
  };

  // Render the form only if the user has the necessary role
  if (!canAddStudent) {
    return (
      <div className="text-center text-red-500 mt-8">
        You do not have permission to access this page. Please log in with an appropriate account.
      </div>
    );
  }

  const formVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto"
      variants={formVariants}
      initial="hidden"
      animate="visible"
    >
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Add New Student</h2>
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="e.g., Mike"
            className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="e.g., Smith"
            className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="schoolNumber" className="block text-sm font-medium text-gray-700 mb-2">School Number</label>
          <input
            type="text"
            id="schoolNumber"
            value={schoolNumber}
            onChange={(e) => setSchoolNumber(e.target.value)}
            placeholder="e.g., 12345"
            className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
          <input
            type="date"
            id="birthDate"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="studentClass" className="block text-sm font-medium text-gray-700 mb-2">Class</label>
          <input
            type="text"
            id="studentClass"
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
            placeholder="e.g., Computer Science"
            className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="courses" className="block text-sm font-medium text-gray-700 mb-2">Courses (comma-separated)</label>
          <input
            type="text"
            id="courses"
            value={courses}
            onChange={(e) => setCourses(e.target.value)}
            placeholder="e.g., Math, Science"
            className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="grades" className="block text-sm font-medium text-gray-700 mb-2">Grades (e.g., Math:A,Science:B)</label>
          <input
            type="text"
            id="grades"
            value={grades}
            onChange={(e) => setGrades(e.target.value)}
            placeholder="e.g., Math:A,Science:B"
            className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="md:col-span-2 text-right">
          <motion.button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Add Student
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddStudent;
