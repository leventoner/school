import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import AddStudent from './AddStudent';
import AuthService from '../services/AuthService';
import { StudentClass, Course, Grade } from '../enums'; // Import StudentClass enum

// Mock AuthService
jest.mock('../services/AuthService');
const mockedAuthService = AuthService as jest.Mocked<typeof AuthService>;

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

// Mock fetch API
global.fetch = jest.fn();

describe('AddStudent', () => {
  beforeEach(() => {
    // Arrange: Mock current user for authorized access
    mockedAuthService.getCurrentUser.mockReturnValue({
      id: 1,
      username: 'testuser',
      // email: 'test@test.com', // Removed email as it's not in LoginResponse type
      roles: ['ROLE_ADMIN'],
    });
    // Mock AuthService.getAuthHeader to return a dummy header
    mockedAuthService.getAuthHeader.mockReturnValue({ Authorization: 'Bearer dummy-token' });

    // Clear mocks before each test
    jest.clearAllMocks();

    // Re-mock current user for each test to ensure isolation
    mockedAuthService.getCurrentUser.mockReturnValue({
      id: 1,
      username: 'testuser',
      roles: ['ROLE_ADMIN'], // Removed email to match LoginResponse type
    });
  });

  test('renders the form for authorized users', () => {
>>>>>>> Stashed changes
<task_progress>
- [x] Define StudentClass enum with specified values
- [x] Integrate enum into backend entity and database mapping
- [x] Integrate enum into frontend (enums.ts)
- [x] Integrate enum into backend controller and service
- [x] Integrate enum into frontend components (AddStudent.tsx)
- [x] Integrate enum into frontend components (UpdateStudent.tsx)
- [x] Add/update tests for enum functionality (AddStudent.tsx)
</task_progress>
>>>>>>> Stashed changes
<task_progress>
- [x] Define StudentClass enum with specified values
- [x] Integrate enum into backend entity and database mapping
- [x] Integrate enum into frontend (enums.ts)
- [x] Integrate enum into backend controller and service
- [x] Integrate enum into frontend components (AddStudent.tsx)
- [x] Integrate enum into frontend components (UpdateStudent.tsx)
- [x] Add/update tests for enum functionality (AddStudent.tsx)
</task_progress>
>>>>>>> Stashed changes
<task_progress>
- [x] Define StudentClass enum with specified values
- [x] Integrate enum into backend entity and database mapping
- [x] Integrate enum into frontend (enums.ts)
- [x] Integrate enum into backend controller and service
- [x] Integrate enum into frontend components (AddStudent.tsx)
- [x] Integrate enum into frontend components (UpdateStudent.tsx)
- [x] Add/update tests for enum functionality (AddStudent.tsx)
</task_progress>
>>>>>>> Stashed changes
<task_progress>
- [x] Define StudentClass enum with specified values
- [x] Integrate enum into backend entity and database mapping
- [x] Integrate enum into frontend (enums.ts)
- [x] Integrate enum into backend controller and service
- [x] Integrate enum into frontend components (AddStudent.tsx)
- [x] Integrate enum into frontend components (UpdateStudent.tsx)
- [x] Add/update tests for enum functionality (AddStudent.tsx)
</task_progress>
>>>>>>> Stashed changes
<task_progress>
- [x] Define StudentClass enum with specified values
- [x] Integrate enum into backend entity and database mapping
- [x] Integrate enum into frontend (enums.ts)
- [x] Integrate enum into backend controller and service
- [x] Integrate enum into frontend components (AddStudent.tsx)
- [x] Integrate enum into frontend components (UpdateStudent.tsx)
- [x] Add/update tests for enum functionality (AddStudent.tsx)
</task_progress>
    // Act
    render(
      <Router>
        <AddStudent />
      </Router>
    );

    // Assert
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/school number/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/birth date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/class/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/courses/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add student/i })).toBeInTheDocument();
  });

  test('does not render the form for unauthorized users', () => {
    // Arrange: Mock current user as null for unauthorized access
    mockedAuthService.getCurrentUser.mockReturnValue(null);

    // Act
    render(
      <Router>
        <AddStudent />
      </Router>
    );

    // Assert
    expect(screen.queryByLabelText(/first name/i)).not.toBeInTheDocument();
    expect(screen.getByText(/you do not have permission/i)).toBeInTheDocument();
  });

  test('renders StudentClass options in the select dropdown', () => {
    // Act
    render(
      <Router>
        <AddStudent />
      </Router>
    );

    // Assert
    const classSelect = screen.getByLabelText(/class/i) as HTMLSelectElement;
    expect(classSelect).toBeInTheDocument();

    // Check if all enum values are present as options
    Object.values(StudentClass).forEach(className => {
      expect(screen.getByRole('option', { name: className })).toBeInTheDocument();
    });
  });

  test('updates studentClass state when a class is selected', () => {
    // Act
    render(
      <Router>
        <AddStudent />
      </Router>
    );

    const classSelect = screen.getByLabelText(/class/i) as HTMLSelectElement;
    const testClass = StudentClass.C2A; // Example class

    // Simulate selecting an option
    fireEvent.change(classSelect, { target: { value: testClass } });

    // Assert that the state has been updated (this requires spying on the state setter or checking the input's value)
    // Since we can't directly access the state setter, we check the input's value after the change
    expect(classSelect).toHaveValue(testClass);
  });

  test('handles form submission and navigates on success', async () => {
    // Arrange
    const mockStudentData = {
      firstName: 'Test',
      lastName: 'Student',
      schoolNumber: '11111',
      birthDate: '2005-05-05',
      studentClass: StudentClass.C3B,
      courses: { [Course.PROGRAMMING]: Grade.B },
    };

    // Mock fetch to return a successful response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 10, ...mockStudentData }),
      status: 201,
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    // Act
    render(
      <Router>
        <AddStudent />
      </Router>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Student' } });
    fireEvent.change(screen.getByLabelText(/school number/i), { target: { value: '11111' } });
    fireEvent.change(screen.getByLabelText(/birth date/i), { target: { value: '2005-05-05' } });

    // Select a class
    const classSelect = screen.getByLabelText(/class/i) as HTMLSelectElement;
    fireEvent.change(classSelect, { target: { value: StudentClass.C3B } });

    // Select a course and grade
    fireEvent.click(screen.getByLabelText(Course.PROGRAMMING.replace(/_/g, ' ')));
    // Note: The grade selection is dynamic, so we might need to wait for it to appear if it's conditional
    // For simplicity, assuming it's available immediately or testing the checkbox is enough for now.
    // If testing grade selection is critical, more complex mocking or interaction might be needed.

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /add student/i }));

    // Assert
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:8083/api/students',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
            'Authorization': 'Bearer dummy-token',
          }),
          body: JSON.stringify(mockStudentData),
        })
      );
      expect(mockedNavigate).toHaveBeenCalledWith('/students');
    });
  });

  test('displays error message for missing required fields', async () => {
    // Act
    render(
      <Router>
        <AddStudent />
      </Router>
    );

    // Try to submit with missing fields
    fireEvent.click(screen.getByRole('button', { name: /add student/i }));

    // Assert
    expect(screen.getByText(/please fill in all required fields/i)).toBeInTheDocument();
    expect(global.fetch).not.toHaveBeenCalled(); // Ensure fetch is not called
  });

  test('displays error message for submission failure', async () => {
    // Arrange
    const mockStudentData = {
      firstName: 'Test',
      lastName: 'Student',
      schoolNumber: '11111',
      birthDate: '2005-05-05',
      studentClass: StudentClass.C3B,
      courses: { [Course.PROGRAMMING]: Grade.B },
    };

    // Mock fetch to return an error response
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Permission denied' }),
      status: 403,
      headers: new Headers({ 'Content-Type': 'application/json' }),
    });

    // Act
    render(
      <Router>
        <AddStudent />
      </Router>
    );

    // Fill in the form fields
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Test' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Student' } });
    fireEvent.change(screen.getByLabelText(/school number/i), { target: { value: '11111' } });
    fireEvent.change(screen.getByLabelText(/birth date/i), { target: { value: '2005-05-05' } });
    const classSelect = screen.getByLabelText(/class/i) as HTMLSelectElement;
    fireEvent.change(classSelect, { target: { value: StudentClass.C3B } });
    fireEvent.click(screen.getByLabelText(Course.PROGRAMMING.replace(/_/g, ' ')));

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /add student/i }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/permission denied/i)).toBeInTheDocument();
      expect(mockedNavigate).not.toHaveBeenCalled(); // Ensure navigation does not happen on error
    });
  });
});
