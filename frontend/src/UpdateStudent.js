import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const credentials = btoa('user:password');
const API_URL = 'http://localhost:8083/api/students';

const UpdateStudent = () => {
  const [student, setStudent] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [studentClass, setStudentClass] = useState('');
  const [courses, setCourses] = useState('');
  const [grades, setGrades] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchStudent = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        headers: { 'Authorization': `Basic ${credentials}` }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStudent(data);
      setFirstName(data.firstName);
      setLastName(data.lastName);
      setBirthDate(data.birthDate);
      setStudentClass(data.studentClass || '');
      setCourses(data.courses.join(', '));
      setGrades(Object.entries(data.grades).map(([key, value]) => `${key}:${value}`).join(', '));
    } catch (e) {
      setError('Could not fetch student data.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent]);

  const handleUpdateStudent = async (e) => {
    e.preventDefault();
    const coursesArray = courses.split(',').map(course => course.trim());
    const gradesObject = grades.split(',').reduce((acc, grade) => {
      const [key, value] = grade.split(':');
      if (key && value) {
        acc[key.trim()] = value.trim();
      }
      return acc;
    }, {});

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
        },
        body: JSON.stringify({
          id: student.id,
          firstName,
          lastName,
          birthDate: birthDate,
          studentClass,
          courses: coursesArray,
          grades: gradesObject
        })
      });

      if (response.ok) {
        navigate('/');
      } else {
        throw new Error('Failed to update student');
      }
    } catch (e) {
      setError('Could not update student.');
      console.error(e);
    }
  };

  if (isLoading) return <p className="text-center text-gray-400">Loading student...</p>;
  if (error) return <p className="text-center text-red-400">{error}</p>;
  if (!student) return <p className="text-center text-gray-500">Student not found.</p>;

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans">
      <div className="container mx-auto p-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-cyan-400">Update Student</h1>
        </header>
        <main>
          <div className="bg-gray-800 p-8 rounded-xl shadow-lg max-w-3xl mx-auto">
            <form onSubmit={handleUpdateStudent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
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
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="md:col-span-2 flex justify-end gap-4 mt-4">
                <button type="button" onClick={() => navigate('/')} className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                  Cancel
                </button>
                <button type="submit" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                  Update Student
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default UpdateStudent;
