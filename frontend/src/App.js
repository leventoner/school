import React, { useState, useEffect, useCallback } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import UpdateStudent from './UpdateStudent';

// Basic Auth credentials - In a real app, use a proper auth system
const credentials = btoa('user:password');
const API_URL = 'http://localhost:8083/api/students';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [newStudentFirstName, setNewStudentFirstName] = useState('');
  const [newStudentLastName, setNewStudentLastName] = useState('');
  const [newStudentBirthDate, setNewStudentBirthDate] = useState('');
  const [newStudentClass, setNewStudentClass] = useState('');
  const [newStudentCourses, setNewStudentCourses] = useState('');
  const [newStudentGrades, setNewStudentGrades] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStudents = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        headers: { 'Authorization': `Basic ${credentials}` }
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setStudents(data);
    } catch (e) {
      setError('Could not fetch students. Is the backend running?');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents]);

  const handleAddStudent = async (e) => {
    e.preventDefault();
    if (!newStudentFirstName || !newStudentLastName || !newStudentBirthDate || !newStudentCourses) {
      alert('Please fill in all fields.');
      return;
    }

    const courses = newStudentCourses.split(',').map(course => course.trim());
    const grades = newStudentGrades.split(',').reduce((acc, grade) => {
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
          firstName: newStudentFirstName,
          lastName: newStudentLastName,
          birthDate: newStudentBirthDate,
          studentClass: newStudentClass,
          courses,
          grades
        })
      });

      if (response.ok) {
        setNewStudentFirstName('');
        setNewStudentLastName('');
        setNewStudentBirthDate('');
        setNewStudentClass('');
        setNewStudentCourses('');
        setNewStudentGrades('');
        fetchStudents(); // Refresh the list
      } else {
        throw new Error('Failed to add student');
      }
    } catch (e) {
      setError('Could not add student.');
      console.error(e);
    }
  };

  const handleDeleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        const response = await fetch(`${API_URL}/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Basic ${credentials}` }
        });

        if (response.ok) {
          fetchStudents(); // Refresh the list
        } else {
          throw new Error('Failed to delete student');
        }
      } catch (e) {
        setError('Could not delete student.');
        console.error(e);
      }
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans">
      <div className="container mx-auto p-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-cyan-400">Student Management</h1>
          <p className="text-gray-400 mt-2">A modern interface built with React & Spring Boot</p>
        </header>

        <main>
          {/* Add Student Form */}
          <div className="bg-gray-800 p-8 rounded-xl shadow-lg mb-12">
            <h2 className="text-3xl font-semibold mb-6 text-white">Add New Student</h2>
            <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
              <div className="col-span-1">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  value={newStudentFirstName}
                  onChange={(e) => setNewStudentFirstName(e.target.value)}
                  placeholder="e.g., Mike"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                <input
                  type="text"
                  id="lastName"
                  value={newStudentLastName}
                  onChange={(e) => setNewStudentLastName(e.target.value)}
                  placeholder="e.g., Smith"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-300 mb-2">Birth Date</label>
                <input
                  type="date"
                  id="birthDate"
                  value={newStudentBirthDate}
                  onChange={(e) => setNewStudentBirthDate(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="studentClass" className="block text-sm font-medium text-gray-300 mb-2">Class</label>
                <input
                  type="text"
                  id="studentClass"
                  value={newStudentClass}
                  onChange={(e) => setNewStudentClass(e.target.value)}
                  placeholder="e.g., Computer Science"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="courses" className="block text-sm font-medium text-gray-300 mb-2">Courses (comma-separated)</label>
                <input
                  type="text"
                  id="courses"
                  value={newStudentCourses}
                  onChange={(e) => setNewStudentCourses(e.target.value)}
                  placeholder="e.g., Math, Science"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="grades" className="block text-sm font-medium text-gray-300 mb-2">Grades (e.g., Math:A,Science:B)</label>
                <input
                  type="text"
                  id="grades"
                  value={newStudentGrades}
                  onChange={(e) => setNewStudentGrades(e.target.value)}
                  placeholder="e.g., Math:A,Science:B"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <button type="submit" className="md:col-span-1 bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300 h-12">
                Add Student
              </button>
            </form>
          </div>

          {/* Student List */}
          <div>
            <h2 className="text-3xl font-semibold mb-6 text-white">Enrolled Students</h2>
            {isLoading && <p className="text-center text-gray-400">Loading students...</p>}
            {error && <p className="text-center text-red-400">{error}</p>}
            {!isLoading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {students.map(student => (
                  <div key={student.id} className="bg-gray-800 rounded-xl shadow-lg p-6 flex flex-col justify-between transition transform hover:-translate-y-2">
                    <div>
                      <h3 className="text-2xl font-bold text-cyan-400">{student.firstName} {student.lastName}</h3>
                      <p className="text-gray-400 mt-1">Birth Date: {student.birthDate}</p>
                      <p className="text-gray-400 mt-1">Class: {student.studentClass}</p>
                      <p className="text-gray-400 mt-1">Courses: {student.courses.join(', ')}</p>
                      <div className="text-gray-400 mt-1">
                        Grades:
                        <ul className="list-disc list-inside">
                          {Object.entries(student.grades).map(([course, grade]) => (
                            <li key={course}>{course}: {grade}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="flex justify-end gap-4 mt-6">
                      <Link to={`/update/${student.id}`} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
                        Update
                      </Link>
                      <button
                        onClick={() => handleDeleteStudent(student.id)}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
             {!isLoading && students.length === 0 && <p className="text-center text-gray-500 mt-8">No students found. Add one above!</p>}
          </div>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<StudentList />} />
      <Route path="/update/:id" element={<UpdateStudent />} />
    </Routes>
  );
};

export default App;
