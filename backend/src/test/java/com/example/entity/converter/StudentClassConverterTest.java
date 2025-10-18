package com.example.entity.converter;

import com.example.entity.enums.StudentClass;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.EnumSource;
import org.junit.jupiter.params.provider.NullSource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

class StudentClassConverterTest {

    private final StudentClassConverter converter = new StudentClassConverter();

    @DisplayName("Should convert StudentClass enum to its database column value")
    @ParameterizedTest
    @EnumSource(StudentClass.class)
    void testConvertToDatabaseColumn(StudentClass studentClass) {
        assertEquals(studentClass.getValue(), converter.convertToDatabaseColumn(studentClass));
    }

    @Test
    @DisplayName("Should return null when converting a null StudentClass to database column")
    void testConvertToDatabaseColumn_withNull() {
        assertNull(converter.convertToDatabaseColumn(null));
    }

    @DisplayName("Should convert database column value to StudentClass enum")
    @ParameterizedTest
    @EnumSource(StudentClass.class)
    void testConvertToEntityAttribute(StudentClass studentClass) {
        assertEquals(studentClass, converter.convertToEntityAttribute(studentClass.getValue()));
    }

    @ParameterizedTest
    @DisplayName("Should return null for null or invalid database column values")
    @NullSource
    @ValueSource(strings = {"", "  ", "invalid"})
    void testConvertToEntityAttribute_withNullOrInvalid(String dbData) {
        assertNull(converter.convertToEntityAttribute(dbData));
    }
}
