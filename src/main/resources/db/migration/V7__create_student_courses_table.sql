CREATE TABLE student_courses (
    student_id BIGINT NOT NULL,
    course VARCHAR(255),
    grade VARCHAR(255),
    PRIMARY KEY (student_id, course),
    FOREIGN KEY (student_id) REFERENCES students(id)
);
