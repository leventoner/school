import React, { useState, useEffect, useCallback } from 'react'; // Import useCallback
import { useParams, Link, useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService'; // Import AuthService

const API_URL = 'http://localhost:8083/api/students';

const StudentDetail = () => {
    const [student, setStudent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
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
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                headers: {
                    'Authorization': AuthService.getAuthHeader().Authorization, // Use JWT token
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
            const data = await response.json();
            setStudent(data);
        } catch (e) {
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
                const response = await fetch(`${API_URL}/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': AuthService.getAuthHeader().Authorization, // Use JWT token
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
                    throw new Error('Failed to delete student');
                }
            } catch (e) {
                setError('Could not delete student. Please check your connection or login status.');
                console.error(e);
            }
        }
    };

    // Check if the current user has ADMIN or MODERATOR roles
    const currentUser = AuthService.getCurrentUser();
    const userRoles = currentUser ? currentUser.roles : [];
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
                        <Link to={`/update/${student.id}`} className="text-blue-500 hover:text-blue-700 font-semibold mr-4">
                            Edit
                        </Link>
                        <button
                            onClick={handleDeleteStudent}
                            className="text-red-500 hover:text-red-700 font-semibold"
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
