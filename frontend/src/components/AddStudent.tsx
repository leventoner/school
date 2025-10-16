import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import { motion } from 'framer-motion';
import { Course, Grade, StudentClass } from '../enums';
import { Student } from '../types';

interface AuthHeader {
  Authorization: string;
}

const API_URL = 'http://localhost:8083/api/students';

const AddStudent: React.FC = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [schoolNumber, setSchoolNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [studentClass, setStudentClass] = useState<StudentClass>(StudentClass.C1A); // Initialize with a default or empty value
  const [courses, setCourses] = useState<Record<Course, Grade>>({} as Record<Course, Grade>);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = AuthService.getCurrentUser();
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  const currentUser = AuthService.getCurrentUser();
  const userRoles = currentUser?.roles ?? [];
  const canAddStudent = userRoles.includes('ROLE_ADMIN') || userRoles.includes('ROLE_MODERATOR');

  const handleCourseChange = (course: Course, checked: boolean) => {
    const newCourses = { ...courses };
    if (checked) {
      newCourses[course] = Grade.A; // Default grade
    } else {
      delete newCourses[course];
    }
    setCourses(newCourses);
  };

  const handleGradeChange = (course: Course, grade: Grade) => {
    const newCourses = { ...courses, [course]: grade };
    setCourses(newCourses);
  };

  const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!canAddStudent) {
      setError('You do not have permission to add students.');
      return;
    }

    if (!firstName || !lastName || !schoolNumber || !birthDate) {
      setError('Please fill in all required fields.');
      return;
    }

    const newStudentData: Omit<Student, 'id'> = {
      firstName,
      lastName,
      schoolNumber,
      birthDate,
      studentClass,
      courses,
    };

    try {
      const authHeader: AuthHeader = AuthService.getAuthHeader();
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authHeader.Authorization
        },
        body: JSON.stringify(newStudentData)
      });

      if (response.ok) {
        navigate('/students');
      } else if (response.status === 403) {
        setError('You do not have permission to add students.');
      } else {
        let errorMessage = 'Failed to add student';
        try {
            const errorData = await response.json();
            errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
        }
        setError(errorMessage);
        console.error(`Add student failed: ${response.status}`);
      }
    } catch (e: any) {
      setError('Could not add student. Please check your connection or login status.');
      console.error(e);
    }
  };

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
          <select
            id="studentClass"
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value as StudentClass)}
            className="w-full bg-gray-50 border border-gray-300 rounded-lg py-3 px-4 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="" disabled>Select a class</option>
            {Object.values(StudentClass).map((cls: StudentClass) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Courses</label>
          <div className="grid grid-cols-2 gap-4">
            {Object.values(Course).map((course) => (
              <div key={course} className="flex items-center">
                <input
                  type="checkbox"
                  id={course}
                  checked={courses.hasOwnProperty(course)}
                  onChange={(e) => handleCourseChange(course, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor={course} className="ml-2 block text-sm text-gray-900">
                  {course.replace(/_/g, ' ')}
                </label>
              </div>
            ))}
          </div>
        </div>
        {Object.keys(courses).length > 0 && (
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Grades</label>
            {Object.keys(courses).map((course) => (
              <div key={course} className="flex items-center mb-2">
                <label htmlFor={`grade-${course}`} className="w-1/2">{course.replace(/_/g, ' ')}</label>
                <select
                  id={`grade-${course}`}
                  value={courses[course as Course]}
                  onChange={(e) => handleGradeChange(course as Course, e.target.value as Grade)}
                  className="w-1/2 bg-gray-50 border border-gray-300 rounded-lg py-2 px-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {Object.values(Grade).map((grade) => (
                    <option key={grade} value={grade}>{grade}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}
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
