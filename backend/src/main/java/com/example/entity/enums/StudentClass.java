package com.example.entity.enums;

import com.fasterxml.jackson.annotation.JsonValue;

public enum StudentClass {
    C1A("1A"),
    C1B("1B"),
    C2A("2A"),
    C2B("2B"),
    C3A("3A"),
    C3B("3B"),
    C4A("4A"),
    C4B("4B");

    private final String value;

    StudentClass(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
