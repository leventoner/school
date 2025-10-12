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
import java.util.List;

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
		Student student1 = new Student(1, "John Doe", "Math");
		Student student2 = new Student(2, "Jane Doe", "History");
		List<Student> allStudents = Arrays.asList(student1, student2);

		given(studentService.getAllStudents()).willReturn(allStudents);

		mockMvc.perform(get("/api/students")
						.with(httpBasic("user", "password")))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.APPLICATION_JSON))
				.andExpect(jsonPath("$.size()").value(2))
				.andExpect(jsonPath("$[0].name").value("John Doe"))
				.andExpect(jsonPath("$[1].name").value("Jane Doe"));
	}

	@Test
	void testGetStudentById() throws Exception {
		Student student = new Student(1, "John Doe", "Math");
		given(studentService.getStudentById(1)).willReturn(student);

		mockMvc.perform(get("/api/students/1")
						.with(httpBasic("user", "password")))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("John Doe"));
	}

	@Test
	void testInsertStudent() throws Exception {
		Student studentToInsert = new Student();
		studentToInsert.setName("New Student");
		studentToInsert.setCourse("Physics");
		Student studentToReturn = new Student(3, "New Student", "Physics");

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
