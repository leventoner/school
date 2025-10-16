package com.example.entity;

import com.example.entity.enums.Course;
import com.example.entity.enums.Grade;
import com.example.entity.enums.StudentClass;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@Entity
@Table(name = "students")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String firstName;
    private String lastName;
    private String schoolNumber;
    private String birthDate;
    @Enumerated(EnumType.STRING)
    private StudentClass studentClass;

    @ElementCollection
    @CollectionTable(name = "student_courses", joinColumns = @JoinColumn(name = "student_id"))
    @MapKeyColumn(name = "course")
    @MapKeyEnumerated(EnumType.STRING)
    @Column(name = "grade")
    @Enumerated(EnumType.STRING)
    private Map<Course, Grade> courses = new HashMap<>();
}
