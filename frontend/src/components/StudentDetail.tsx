import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

// Define interfaces for types used in the component
// interface User {
//   id: number;
//   username: string;
//   roles: string[];
// }

interface AuthHeader {
  Authorization: string;
}

interface Grades {
  [key: string]: string;
}

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  schoolNumber?: string | null;
  birthDate: string;
  studentClass?: string | null;
  courses: string[];
  grades: Grades;
}

const API_URL = 'http://localhost:8083/api/students';

const StudentDetail: React.FC = () => {
    const [student, setStudent] = useState<Student | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { id } = useParams<{ id: string }>(); // useParams returns string for route params
    const navigate = useNavigate();

    // Redirect to login if not authenticated
    useEffect(() => {
        const user = AuthService.getCurrentUser();
        if (!user) {
            navigate('/login');
        }
    }, [navigate]);

    const fetchStudent = useCallback(async () => {
        setIsLoading(true);
        setError(null); // Clear previous errors
        try {
            const authHeader: AuthHeader = AuthService.getAuthHeader();
            const response = await fetch(`${API_URL}/${id}`, {
                headers: {
                    'Authorization': authHeader.Authorization, // Use JWT token
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
            setStudent(data);
        } catch (e: any) { // Catch any type for broader error handling
            setError('Could not fetch student data. Please check your connection or login status.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [id, navigate]); // Include navigate in dependencies

    useEffect(() => {
        fetchStudent();
    }, [fetchStudent]);

    const handleDeleteStudent = async () => {
        if (window.confirm('Are you sure you want to delete this student?')) {
            try {
                const authHeader: AuthHeader = AuthService.getAuthHeader();
                const response = await fetch(`${API_URL}/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': authHeader.Authorization, // Use JWT token
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 403) {
                    setError('You do not have permission to delete this student.');
                    return;
                }

                if (response.ok) {
                    navigate('/students'); // Redirect to student list after successful deletion
                } else {
                    // Attempt to parse error message from backend if available
                    let errorMessage = 'Failed to delete student';
                    try {
                        const errorData = await response.json();
                        errorMessage = errorData.message || errorMessage;
                    } catch (parseError) {
                        // Ignore if error response is not JSON
                    }
                    setError(errorMessage);
                    console.error(`Delete failed: ${response.status}`);
                }
            } catch (e: any) {
                setError('Could not delete student. Please check your connection or login status.');
                console.error(e);
            }
        }
    };

    // Check if the current user has ADMIN or MODERATOR roles
    const currentUser = AuthService.getCurrentUser();
    // Safely access roles, defaulting to an empty array if currentUser or currentUser.roles is null/undefined
    const userRoles = currentUser?.roles ?? [];
    const canEditOrDelete = userRoles.includes('ROLE_ADMIN') || userRoles.includes('ROLE_MODERATOR');

    if (isLoading) {
        return <p className="text-center text-gray-500">Loading student details...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500">{error}</p>;
    }

    if (!student) {
        return <p className="text-center text-gray-500">Student not found.</p>;
    }

    return (
        <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex justify-between items-start">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4">{student.firstName} {student.lastName}</h2>
                {canEditOrDelete && ( // Conditionally render Edit and Delete buttons
                    <div className="flex items-center">
                        <Link to={`/update/${student.id}`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-4">
                            Edit
                        </Link>
                        <button
                            onClick={handleDeleteStudent}
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <p className="text-sm text-gray-500">School Number</p>
                    <p className="text-lg font-medium text-gray-900">{student.schoolNumber}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Birth Date</p>
                    <p className="text-lg font-medium text-gray-900">{student.birthDate}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Class</p>
                    <p className="text-lg font-medium text-gray-900">{student.studentClass}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Courses</p>
                    <p className="text-lg font-medium text-gray-900">{student.courses.join(', ')}</p>
                </div>
                <div className="md:col-span-2">
                    <p className="text-sm text-gray-500">Grades</p>
                    <ul className="list-disc list-inside">
                        {Object.entries(student.grades).map(([course, grade]) => (
                            <li key={course} className="text-lg font-medium text-gray-900">{course}: {grade}</li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="mt-6">
                <Link to="/students" className="text-blue-500 hover:text-blue-700 font-semibold">
                    &larr; Back to Student List
                </Link>
            </div>
        </div>
    );
};

export default StudentDetail;
