import React, { useState, useEffect } from 'react'; // Import useEffect
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService'; // Import AuthService

const API_URL = 'http://localhost:8083/api/students';

const AddStudent = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [schoolNumber, setSchoolNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [courses, setCourses] = useState('');
  const [grades, setGrades] = useState('');
  const [error, setError] = useState(null);
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
  const userRoles = currentUser ? currentUser.roles : [];
  const canAddStudent = userRoles.includes('ROLE_ADMIN') || userRoles.includes('ROLE_MODERATOR');

  const handleAddStudent = async (e) => {
    e.preventDefault();

    // If the user doesn't have the required role, prevent submission
    if (!canAddStudent) {
      setError('You do not have permission to add students.');
      return;
    }

    if (!firstName || !lastName || !schoolNumber || !birthDate || !courses) {
      alert('Please fill in all required fields.');
      return;
    }

    const coursesArray = courses.split(',').map(course => course.trim());
    const gradesObject = grades.split(',').reduce((acc, grade) => {
      const [key, value] = grade.split(':');
      if (key && value) {
        acc[key.trim()] = value.trim();
      }
      return acc;
    }, {});

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': AuthService.getAuthHeader().Authorization // Use JWT token
        },
        body: JSON.stringify({
          firstName,
          lastName,
          schoolNumber,
          birthDate,
          studentClass,
          courses: coursesArray,
          grades: gradesObject
        })
      });

      if (response.ok) {
        navigate('/students'); // Redirect to student list after successful addition
      } else if (response.status === 403) {
        setError('You do not have permission to add students.');
      } else {
        throw new Error('Failed to add student');
      }
    } catch (e) {
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

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-2xl mx-auto">
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
            Add Student
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;
