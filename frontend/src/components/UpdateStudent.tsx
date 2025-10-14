import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

// Define the interface for the Student object
interface Student {
  id: number;
  firstName: string;
  lastName: string;
  schoolNumber?: string;
  birthDate: string;
  studentClass?: string;
  courses: string[];
  grades: { [key: string]: string };
}

// Define the type for the current user from AuthService
interface CurrentUser {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

// Define the type for the authorization header
interface AuthHeader {
  Authorization: string;
}

const API_URL = 'http://localhost:8083/api/students';

const UpdateStudent: React.FC = () => {
  const [student, setStudent] = useState<Student | null>(null); // State for the fetched student data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [schoolNumber, setSchoolNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [courses, setCourses] = useState('');
  const [grades, setGrades] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>(); // Type for useParams to get the student ID
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    const user = AuthService.getCurrentUser() as CurrentUser | null;
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  // Fetch student data for pre-population
  const fetchStudentData = useCallback(async () => {
    try {
      // Type assertion for getAuthHeader, assuming it returns an object with Authorization property
      const authHeader = AuthService.getAuthHeader() as AuthHeader;

      const response = await fetch(`${API_URL}/${id}`, {
        headers: {
          'Authorization': authHeader.Authorization,
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
      const data: Student = await response.json();
      setStudent(data); // Set the fetched student data
      setFirstName(data.firstName || '');
      setLastName(data.lastName || '');
      setSchoolNumber(data.schoolNumber || '');
      setBirthDate(data.birthDate || '');
      setStudentClass(data.studentClass || '');
      setCourses(data.courses ? data.courses.join(', ') : '');
      setGrades(data.grades ? Object.entries(data.grades).map(([key, value]) => `${key}:${value}`).join(',') : '');
    } catch (e) {
      setError('Could not fetch student data. Please check your connection or login status.');
      console.error(e);
    }
  }, [id, navigate]); // Dependencies for useCallback

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]); // Fetch data when the component mounts or id/navigate changes

  // Check if the current user has ADMIN or MODERATOR roles
  const currentUser = AuthService.getCurrentUser() as CurrentUser | null;
  const userRoles = currentUser ? currentUser.roles : [];
  const canUpdateStudent = userRoles.includes('ROLE_ADMIN') || userRoles.includes('ROLE_MODERATOR');

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    // If the user doesn't have the required role, prevent submission
    if (!canUpdateStudent) {
      setError('You do not have permission to update students.');
      return;
    }

    // Basic validation for required fields
    if (!firstName || !lastName || !schoolNumber || !birthDate || !courses) {
      alert('Please fill in all required fields.');
      return;
    }

    // Process courses and grades from string inputs
    const coursesArray = courses.split(',').map(course => course.trim()).filter(Boolean); // Filter out empty strings
    const gradesObject = grades.split(',').reduce((acc: { [key: string]: string }, grade) => {
      const [key, value] = grade.split(':');
      if (key && value) {
        acc[key.trim()] = value.trim();
      }
      return acc;
    }, {});

    try {
      const authHeader = AuthService.getAuthHeader() as AuthHeader;

      // Ensure student object is not null before accessing its properties for the update
      if (!student) {
        setError('Student data is missing. Cannot update.');
        return;
      }

      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader.Authorization
        },
        body: JSON.stringify({
          id: student.id, // Use the ID from the fetched student data
          firstName,
          lastName,
          schoolNumber,
          birthDate: birthDate,
          studentClass,
          courses: coursesArray,
          grades: gradesObject
        })
      });

      if (response.ok) {
        navigate('/students'); // Redirect to student list after successful update
      } else if (response.status === 403) {
        setError('You do not have permission to update this student.');
      } else {
        // Attempt to parse error message from response if available
        let errorMessage = 'Failed to update student';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
          // Ignore if response is not JSON or empty
        }
        throw new Error(errorMessage);
      }
    } catch (e) {
      setError((e as Error).message || 'Could not update student. Please check your connection or login status.');
      console.error(e);
    }
  };

  // Render a message if the user doesn't have permission
  if (!canUpdateStudent) {
    return (
      <div className="text-center text-red-500 mt-8">
        You do not have permission to access this page. Please log in with an appropriate account.
      </div>
    );
  }

  // Render loading or error states
  if (!student) { // This check is technically redundant if fetchStudentData is called and sets student, but good for safety
    return <p className="text-center text-gray-500">Loading student details...</p>;
  }
  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  // Render the form if the user has the necessary role and data is loaded
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
      <h2 className="text-3xl font-semibold mb-6 text-gray-800">Update Student</h2>
      {error && <p className="text-center text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleUpdateStudent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="e.g., Mike"
            className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
            Update Student
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateStudent;
