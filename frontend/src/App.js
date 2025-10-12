import React, { useState, useEffect, useCallback } from 'react';

// Basic Auth credentials - In a real app, use a proper auth system
const credentials = btoa('user:password');
const API_URL = 'http://localhost:8083/api/students';

const App = () => {
  const [students, setStudents] = useState([]);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentCourse, setNewStudentCourse] = useState('');
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
    if (!newStudentName || !newStudentCourse) {
      alert('Please fill in both name and course.');
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`
        },
        body: JSON.stringify({ name: newStudentName, course: newStudentCourse })
      });

      if (response.ok) {
        setNewStudentName('');
        setNewStudentCourse('');
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
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Student Name</label>
                <input
                  type="text"
                  id="name"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="e.g., Mike"
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="course" className="block text-sm font-medium text-gray-300 mb-2">Course</label>
                <input
                  type="text"
                  id="course"
                  value={newStudentCourse}
                  onChange={(e) => setNewStudentCourse(e.target.value)}
                  placeholder="e.g., Math"
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
                      <h3 className="text-2xl font-bold text-cyan-400">{student.name}</h3>
                      <p className="text-gray-400 mt-1">{student.course}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteStudent(student.id)}
                      className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg self-end transition duration-300"
                    >
                      Delete
                    </button>
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

export default App;
