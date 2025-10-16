import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import { motion } from 'framer-motion';
import { Student } from '../types';
import { Course, Grade, StudentClass } from '../enums';

interface CurrentUser {
  id: number;
  username: string;
  email: string;
  roles: string[];
}

interface AuthHeader {
  Authorization: string;
}

const API_URL = 'http://localhost:8083/api/students';

const UpdateStudent: React.FC = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [schoolNumber, setSchoolNumber] = useState('');
  const [birthDate, setBirthDate] = useState('');
  // Initialize with a valid enum value or handle potential empty string from API
  const [studentClass, setStudentClass] = useState<StudentClass>(StudentClass.C1A);
  const [courses, setCourses] = useState<Record<Course, Grade>>({} as Record<Course, Grade>);
  const [error, setError] = useState<string | null>(null);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const user = AuthService.getCurrentUser() as CurrentUser | null;
    if (!user) {
      navigate('/login');
    }
  }, [navigate]);

  const fetchStudentData = useCallback(async () => {
    try {
      const authHeader = AuthService.getAuthHeader() as AuthHeader;
      const response = await fetch(`${API_URL}/${id}`, {
        headers: {
          'Authorization': authHeader.Authorization,
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 401 || response.status === 403) {
        AuthService.logout();
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Student = await response.json();
      setStudent(data);
      setFirstName(data.firstName || '');
      setLastName(data.lastName || '');
      setSchoolNumber(data.schoolNumber || '');
      setBirthDate(data.birthDate || '');
      // Safely set studentClass, ensuring it's a valid StudentClass enum value
      const fetchedClassString = data.studentClass; // This is the string value from the API (e.g., "1A")
      if (fetchedClassString) {
        // Find the corresponding enum key (e.g., "C1A") from the string value
        const enumKey = Object.keys(StudentClass).find(key => StudentClass[key as keyof typeof StudentClass] === fetchedClassString);
        if (enumKey) {
          setStudentClass(StudentClass[enumKey as keyof typeof StudentClass]);
        } else {
          // If fetchedClassString is not a valid enum value, set a default
          setStudentClass(StudentClass.C1A); // Default to C1A or another appropriate default
        }
      } else {
        // If fetchedClassString is null or undefined, set a default
        setStudentClass(StudentClass.C1A); // Default to C1A or another appropriate default
      }
      setCourses(data.courses || ({} as Record<Course, Grade>));
    } catch (e) {
      setError('Could not fetch student data. Please check your connection or login status.');
      console.error(e);
    }
  }, [id, navigate]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  const currentUser = AuthService.getCurrentUser() as CurrentUser | null;
  const userRoles = currentUser ? currentUser.roles : [];
  const canUpdateStudent = userRoles.includes('ROLE_ADMIN') || userRoles.includes('ROLE_MODERATOR');

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

  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!canUpdateStudent) {
      setError('You do not have permission to update students.');
      return;
    }

    if (!firstName || !lastName || !schoolNumber || !birthDate) {
      alert('Please fill in all required fields.');
      return;
    }

    try {
      const authHeader = AuthService.getAuthHeader() as AuthHeader;

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
          id: student.id,
          firstName,
          lastName,
          schoolNumber,
          birthDate: birthDate,
          studentClass,
          courses: courses,
        })
      });

      if (response.ok) {
        navigate('/students');
      } else if (response.status === 403) {
        setError('You do not have permission to update this student.');
      } else {
        let errorMessage = 'Failed to update student';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch (parseError) {
        }
        throw new Error(errorMessage);
      }
    } catch (e) {
      setError((e as Error).message || 'Could not update student. Please check your connection or login status.');
      console.error(e);
    }
  };

  if (!canUpdateStudent) {
    return (
      <div className="text-center text-red-500 mt-8">
        You do not have permission to access this page. Please log in with an appropriate account.
      </div>
    );
  }

  if (!student) {
    return <p className="text-center text-gray-500">Loading student details...</p>;
  }
  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
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
            Update Student
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default UpdateStudent;
