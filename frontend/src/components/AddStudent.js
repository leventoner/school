import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const credentials = btoa('user:password');
const API_URL = 'http://localhost:8083/api/students';

const AddStudent = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [courses, setCourses] = useState('');
  const [grades, setGrades] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!firstName || !lastName || !birthDate || !courses) {
      alert('Please fill in all fields.');
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
          'Authorization': `Basic ${credentials}`
        },
        body: JSON.stringify({
          firstName,
          lastName,
          birthDate,
          studentClass,
          courses: coursesArray,
          grades: gradesObject
        })
      });

      if (response.ok) {
        navigate('/students'); // Redirect to student list after successful addition
      } else {
        throw new Error('Failed to add student');
      }
    } catch (e) {
      setError('Could not add student.');
      console.error(e);
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-semibold mb-6 text-white">Add New Student</h2>
      {error && <p className="text-center text-red-400 mb-4">{error}</p>}
      <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="e.g., Mike"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="e.g., Smith"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <div>
          <label htmlFor="birthDate" className="block text-sm font-medium text-gray-300 mb-2">Birth Date</label>
          <input
            type="date"
            id="birthDate"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <div>
          <label htmlFor="studentClass" className="block text-sm font-medium text-gray-300 mb-2">Class</label>
          <input
            type="text"
            id="studentClass"
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
            placeholder="e.g., Computer Science"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="courses" className="block text-sm font-medium text-gray-300 mb-2">Courses (comma-separated)</label>
          <input
            type="text"
            id="courses"
            value={courses}
            onChange={(e) => setCourses(e.target.value)}
            placeholder="e.g., Math, Science"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <div className="md:col-span-2">
          <label htmlFor="grades" className="block text-sm font-medium text-gray-300 mb-2">Grades (e.g., Math:A,Science:B)</label>
          <input
            type="text"
            id="grades"
            value={grades}
            onChange={(e) => setGrades(e.target.value)}
            placeholder="e.g., Math:A,Science:B"
            className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
        </div>
        <div className="md:col-span-2 text-right">
          <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
            Add Student
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddStudent;
