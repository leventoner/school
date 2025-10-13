import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const credentials = btoa('user:password');
const API_URL = 'http://localhost:8083/api/students';

const StudentList = () => {
  const [students, setStudents] = useState([]);
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
       {!isLoading && students.length === 0 && <p className="text-center text-gray-500 mt-8">No students found. Add one!</p>}
    </div>
  );
};

export default StudentList;
