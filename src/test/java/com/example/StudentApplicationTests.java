package com.example;

import com.example.entity.Student;
import com.example.service.StudentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;


import java.util.Arrays;
import java.util.Collections;
import java.util.List;
// import java.util.Map; // Removed unused import

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.BDDMockito.given;
import static org.mockito.Mockito.doNothing;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.httpBasic;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class StudentApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@MockBean
	private StudentService studentService;

	@Autowired
	private ObjectMapper objectMapper;

	@Test
	void contextLoads() {
	}

	@Test
	void testGetAllStudents() throws Exception {
		Student student1 = new Student(1, "John", "Doe", "12345", "2004-01-01", "ClassA", Collections.singletonList("Math"), Collections.singletonMap("Math", "A"));
		Student student2 = new Student(2, "Jane", "Doe", "67890", "2002-01-01", "ClassB", Collections.singletonList("History"), Collections.singletonMap("History", "B"));
		List<Student> allStudents = Arrays.asList(student1, student2);

		given(studentService.getAllStudents()).willReturn(allStudents);

		mockMvc.perform(get("/api/students")
						.with(httpBasic("user", "password")))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.size()").value(2))
				.andExpect(jsonPath("$[0].firstName").value("John"))
				.andExpect(jsonPath("$[1].firstName").value("Jane"));
	}

	@Test
	void testGetStudentById() throws Exception {
		Student student = new Student(1, "John", "Doe", "12345", "2004-01-01", "ClassA", Collections.singletonList("Math"), Collections.singletonMap("Math", "A"));
		given(studentService.getStudentById(1)).willReturn(student);

		mockMvc.perform(get("/api/students/1")
						.with(httpBasic("user", "password")))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.firstName").value("John"));
	}

	@Test
	void testInsertStudent() throws Exception {
		Student studentToInsert = new Student();
		studentToInsert.setFirstName("New");
		studentToInsert.setLastName("Student");
		studentToInsert.setSchoolNumber("99999");
		studentToInsert.setBirthDate("1999-01-01");
		studentToInsert.setStudentClass("ClassC");
		studentToInsert.setCourses(Collections.singletonList("Physics"));
		studentToInsert.setGrades(Collections.singletonMap("Physics", "C"));
		
		Student studentToReturn = new Student();
		studentToReturn.setId(3);
		studentToReturn.setFirstName("New");
		studentToReturn.setLastName("Student");
		studentToReturn.setSchoolNumber("99999");
		studentToReturn.setBirthDate("1999-01-01");
		studentToReturn.setStudentClass("ClassC");
		studentToReturn.setCourses(Collections.singletonList("Physics"));
		studentToReturn.setGrades(Collections.singletonMap("Physics", "C"));

		given(studentService.insertStudent(any(Student.class))).willReturn(studentToReturn);

		mockMvc.perform(post("/api/students")
						.with(httpBasic("user", "password"))
						.contentType(MediaType.APPLICATION_JSON)
						.content(objectMapper.writeValueAsString(studentToInsert)))
				.andExpect(status().isCreated())
				.andExpect(header().string("Location", "http://localhost/api/students/3"));
	}

	@Test
	void testDeleteStudentById() throws Exception {
		doNothing().when(studentService).removeStudentById(1);

		mockMvc.perform(delete("/api/students/1")
						.with(httpBasic("user", "password")))
				.andExpect(status().isNoContent());
	}
}
