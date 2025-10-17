package com.example.entity.converter;

import com.example.entity.enums.StudentClass;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class StudentClassConverter implements AttributeConverter<StudentClass, String> {

    @Override
    public String convertToDatabaseColumn(StudentClass studentClass) {
        if (studentClass == null) {
            return null;
        }
        return studentClass.getValue();
    }

    @Override
    public StudentClass convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return null;
        }
        try {
            return StudentClass.valueOf(dbData.toUpperCase().replace("-", ""));
        } catch (IllegalArgumentException e) {
            // Log the error and return null or a default value
            return null;
        }
    }
}
