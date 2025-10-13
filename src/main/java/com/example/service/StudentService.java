package com.example.service;

import com.example.entity.Student;
import com.example.exception.ResourceNotFoundException;
import com.example.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.Collection;

@Service
public class StudentService {

    private final StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository) {
        this.studentRepository = studentRepository;
    }

    public Collection<Student> getAllStudents(){
        return this.studentRepository.findAll();
    }

    public Student getStudentById(int id){
        return this.studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    public void removeStudentById(int id) {
        Student student = this.studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
        this.studentRepository.delete(student);
    }

    public Student updateStudent(int id, Student studentDetails){
        Student student = this.studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));

        student.setFirstName(studentDetails.getFirstName());
        student.setLastName(studentDetails.getLastName());
        student.setBirthDate(studentDetails.getBirthDate());
        student.setStudentClass(studentDetails.getStudentClass());
        student.setCourses(studentDetails.getCourses());
        student.setGrades(studentDetails.getGrades());

        return this.studentRepository.save(student);
    }

    public Student insertStudent(Student student) {
        return this.studentRepository.save(student);
    }
}
