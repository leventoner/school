package com.example.controller;

import com.example.entity.Student;
import com.example.security.jwt.JwtUtils;
import com.example.security.services.UserDetailsServiceImpl;
import com.example.service.StudentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import com.example.exception.ResourceNotFoundException;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyInt;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.doThrow;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(StudentController.class)
public class StudentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private StudentService studentService;

    // Mock these beans to satisfy Spring Security configuration during test
    @MockBean
    private UserDetailsServiceImpl userDetailsService;

    @MockBean
    private JwtUtils jwtUtils;

    @Autowired
    private ObjectMapper objectMapper;

    private Student student;

    @BeforeEach
    void setUp() {
        student = new Student();
        student.setId(1);
        student.setFirstName("John");
        student.setLastName("Doe");
    }

    @Test
    @WithMockUser // Add mock user to satisfy security context
    void testGetAllStudents() throws Exception {
        when(studentService.getAllStudents()).thenReturn(Collections.singletonList(student));

        mockMvc.perform(get("/api/students"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].firstName", is("John")));
    }

    @Test
    @WithMockUser // Add mock user to satisfy security context
    void testGetStudentById() throws Exception {
        when(studentService.getStudentById(1)).thenReturn(student);

        mockMvc.perform(get("/api/students/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName", is("John")));
    }

    @Test
    @WithMockUser
    void testGetStudentById_NotFound() throws Exception {
        when(studentService.getStudentById(99)).thenThrow(new ResourceNotFoundException("Student not found"));

        mockMvc.perform(get("/api/students/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username="admin", roles={"ADMIN"})
    void testInsertStudent() throws Exception {
        when(studentService.insertStudent(any(Student.class))).thenReturn(student);

        mockMvc.perform(post("/api/students").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(student)))
                .andExpect(status().isCreated())
                .andExpect(header().exists("Location"))
                .andExpect(jsonPath("$.firstName", is("John")));
    }

    @Test
    @WithMockUser(username="admin", roles={"ADMIN"})
    void testUpdateStudent() throws Exception {
        Student updatedStudent = new Student();
        updatedStudent.setId(1);
        updatedStudent.setFirstName("Jane");
        updatedStudent.setLastName("Doe");

        when(studentService.updateStudent(anyInt(), any(Student.class))).thenReturn(updatedStudent);

        mockMvc.perform(put("/api/students/1").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedStudent)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.firstName", is("Jane")));
    }

    @Test
    @WithMockUser(username="admin", roles={"ADMIN"})
    void testUpdateStudent_NotFound() throws Exception {
        Student updatedStudent = new Student();
        updatedStudent.setFirstName("Jane");

        when(studentService.updateStudent(anyInt(), any(Student.class))).thenThrow(new ResourceNotFoundException("Student not found"));

        mockMvc.perform(put("/api/students/99").with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedStudent)))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(username="admin", roles={"ADMIN"})
    void testDeleteStudentById() throws Exception {
        doNothing().when(studentService).removeStudentById(1);

        mockMvc.perform(delete("/api/students/1").with(csrf()))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(username="admin", roles={"ADMIN"})
    void testDeleteStudentById_NotFound() throws Exception {
        doThrow(new ResourceNotFoundException("Student not found")).when(studentService).removeStudentById(99);

        mockMvc.perform(delete("/api/students/99").with(csrf()))
                .andExpect(status().isNotFound());
    }
}
