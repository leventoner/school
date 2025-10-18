package com.example;

import com.example.entity.Student;
import com.example.entity.enums.Course;
import com.example.entity.enums.Grade;
import com.example.entity.enums.StudentClass;
import com.example.service.StudentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import com.example.entity.enums.Course;
import com.example.entity.enums.Grade;
import com.example.entity.enums.StudentClass;
import com.example.payload.request.LoginRequest;
import com.example.payload.response.JwtResponse;
import com.example.service.StudentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class StudentApplicationTests extends AbstractIntegrationTest {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private StudentService studentService;

	@Autowired
	private ObjectMapper objectMapper;

	private String jwtToken;

	@BeforeEach
	void setUp() throws Exception {
		LoginRequest loginRequest = new LoginRequest("root", "root");

		MvcResult result = mockMvc.perform(post("/api/auth/signin")
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(loginRequest)))
				.andExpect(status().isOk())
				.andReturn();

		String responseContent = result.getResponse().getContentAsString();
		JwtResponse jwtResponse = objectMapper.readValue(responseContent, JwtResponse.class);
		jwtToken = jwtResponse.getToken();
	}

	@Test
	void contextLoads() {
	}

	@Test
	void testGetAllStudents() throws Exception {
		Map<Course, Grade> courses1 = new HashMap<>();
		courses1.put(Course.COMPUTER_SCIENCE, Grade.A);
		Student student1 = new Student(1, "John", "Doe", "12345", "2004-01-01", StudentClass.C1A, courses1);

		Map<Course, Grade> courses2 = new HashMap<>();
		courses2.put(Course.PROGRAMMING, Grade.B);
		Student student2 = new Student(2, "Jane", "Doe", "67890", "2002-01-01", StudentClass.C1B, courses2);
		List<Student> allStudents = Arrays.asList(student1, student2);

		given(studentService.getAllStudents()).willReturn(allStudents);

		mockMvc.perform(get("/api/students")
						.header("Authorization", "Bearer " + jwtToken))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.size()").value(2))
				.andExpect(jsonPath("$[0].firstName").value("John"))
				.andExpect(jsonPath("$[1].firstName").value("Jane"));
	}

	@Test
	void testGetStudentById() throws Exception {
		Map<Course, Grade> courses = new HashMap<>();
		courses.put(Course.COMPUTER_SCIENCE, Grade.A);
		Student student = new Student(1, "John", "Doe", "12345", "2004-01-01", StudentClass.C1A, courses);
		given(studentService.getStudentById(1)).willReturn(student);

		mockMvc.perform(get("/api/students/1")
						.header("Authorization", "Bearer " + jwtToken))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.firstName").value("John"));
	}

	@Test
	void testInsertStudent() throws Exception {
		Map<Course, Grade> courses = new HashMap<>();
		courses.put(Course.DATA_SCIENCE, Grade.C);

		Student studentToInsert = new Student();
		studentToInsert.setFirstName("New");
		studentToInsert.setLastName("Student");
		studentToInsert.setSchoolNumber("99999");
		studentToInsert.setBirthDate("1999-01-01");
		studentToInsert.setStudentClass(StudentClass.C2A);
		studentToInsert.setCourses(courses);

		Student studentToReturn = new Student();
		studentToReturn.setId(3);
		studentToReturn.setFirstName("New");
		studentToReturn.setLastName("Student");
		studentToReturn.setSchoolNumber("99999");
		studentToReturn.setBirthDate("1999-01-01");
		studentToReturn.setStudentClass(StudentClass.C2A);
		studentToReturn.setCourses(courses);

		given(studentService.insertStudent(any(Student.class))).willReturn(studentToReturn);

		mockMvc.perform(post("/api/students")
						.header("Authorization", "Bearer " + jwtToken)
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(studentToInsert)))
				.andExpect(status().isCreated())
				.andExpect(header().string("Location", "http://localhost/api/students/3"));
	}

	@Test
	void testDeleteStudentById() throws Exception {
		doNothing().when(studentService).removeStudentById(1);

		mockMvc.perform(delete("/api/students/1")
						.header("Authorization", "Bearer " + jwtToken))
				.andExpect(status().isNoContent());
	}
}
