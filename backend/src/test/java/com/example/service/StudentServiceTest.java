package com.example.service;

import com.example.entity.Student;
import com.example.exception.ResourceNotFoundException;
import com.example.repository.StudentRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class StudentServiceTest {

    @Mock
    private StudentRepository studentRepository;

    @InjectMocks
    private StudentService studentService;

    private Student student;

    @BeforeEach
    void setUp() {
        student = new Student();
        student.setId(1);
        student.setFirstName("John");
        student.setLastName("Doe");
    }

    @Test
    void testGetAllStudents() {
        when(studentRepository.findAll()).thenReturn(Collections.singletonList(student));
        List<Student> students = (List<Student>) studentService.getAllStudents();
        assertFalse(students.isEmpty());
        assertEquals(1, students.size());
        verify(studentRepository, times(1)).findAll();
    }

    @Test
    void testGetStudentById_Success() {
        when(studentRepository.findById(1)).thenReturn(Optional.of(student));
        Student foundStudent = studentService.getStudentById(1);
        assertNotNull(foundStudent);
        assertEquals(student.getId(), foundStudent.getId());
        verify(studentRepository, times(1)).findById(1);
    }

    @Test
    void testGetStudentById_NotFound() {
        when(studentRepository.findById(1)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> {
            studentService.getStudentById(1);
        });
        verify(studentRepository, times(1)).findById(1);
    }

    @Test
    void testInsertStudent() {
        when(studentRepository.save(any(Student.class))).thenReturn(student);
        Student savedStudent = studentService.insertStudent(new Student());
        assertNotNull(savedStudent);
        assertEquals(student.getFirstName(), savedStudent.getFirstName());
        verify(studentRepository, times(1)).save(any(Student.class));
    }

    @Test
    void testUpdateStudent_Success() {
        Student studentDetails = new Student();
        studentDetails.setFirstName("Jane");
        studentDetails.setLastName("Doe");

        when(studentRepository.findById(1)).thenReturn(Optional.of(student));
        when(studentRepository.save(any(Student.class))).thenAnswer(invocation -> invocation.getArgument(0));

        Student updatedStudent = studentService.updateStudent(1, studentDetails);

        assertNotNull(updatedStudent);
        assertEquals("Jane", updatedStudent.getFirstName());
        verify(studentRepository, times(1)).findById(1);
        verify(studentRepository, times(1)).save(any(Student.class));
    }

    @Test
    void testUpdateStudent_NotFound() {
        when(studentRepository.findById(1)).thenReturn(Optional.empty());
        Student studentDetails = new Student();
        assertThrows(ResourceNotFoundException.class, () -> {
            studentService.updateStudent(1, studentDetails);
        });
        verify(studentRepository, times(1)).findById(1);
        verify(studentRepository, never()).save(any(Student.class));
    }

    @Test
    void testRemoveStudentById_Success() {
        when(studentRepository.findById(1)).thenReturn(Optional.of(student));
        doNothing().when(studentRepository).delete(student);
        studentService.removeStudentById(1);
        verify(studentRepository, times(1)).findById(1);
        verify(studentRepository, times(1)).delete(student);
    }

    @Test
    void testRemoveStudentById_NotFound() {
        when(studentRepository.findById(1)).thenReturn(Optional.empty());
        assertThrows(ResourceNotFoundException.class, () -> {
            studentService.removeStudentById(1);
        });
        verify(studentRepository, times(1)).findById(1);
        verify(studentRepository, never()).delete(any(Student.class));
    }
}
