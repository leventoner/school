package com.example.security.jwt;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.junit.jupiter.api.AfterEach;
import org.springframework.security.core.AuthenticationException;
import org.mockito.MockedStatic;
import org.mockito.Mockito;

import com.fasterxml.jackson.databind.ObjectMapper;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthEntryPointJwtTest {

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private AuthenticationException authException;

    @InjectMocks
    private AuthEntryPointJwt authEntryPointJwt;

    @BeforeEach
    void setUp() {
    }

    @AfterEach
    void tearDown() {
    }

    @Test
    void commence_shouldReturnUnauthorizedResponse() throws IOException, ServletException {
        // Arrange
        String errorMessage = "Invalid token";
        String requestUrl = "/api/test";
        int expectedStatus = HttpServletResponse.SC_UNAUTHORIZED;

        when(request.getServletPath()).thenReturn(requestUrl);
        when(request.getRequestURL()).thenReturn(new StringBuffer("http://localhost/api/test"));
        when(authException.getMessage()).thenReturn(errorMessage);

        MockHttpServletResponse mockResponse = new MockHttpServletResponse();
        authEntryPointJwt.commence(request, mockResponse, authException);

        // Assert
        assertEquals(MediaType.APPLICATION_JSON_VALUE, mockResponse.getContentType());
        assertEquals(expectedStatus, mockResponse.getStatus());

        // Verify the JSON response body
        Map<String, Object> expectedBody = new HashMap<>();
        expectedBody.put("status", expectedStatus);
        expectedBody.put("error", "Unauthorized");
        expectedBody.put("message", errorMessage);
        expectedBody.put("path", requestUrl);

        ObjectMapper mapper = new ObjectMapper();
        String expectedJson = mapper.writeValueAsString(expectedBody);
        assertEquals(expectedJson, mockResponse.getContentAsString());

    }

    @Test
    void commence_withDifferentErrorMessage() throws IOException, ServletException {
        // Arrange
        String errorMessage = "Authentication failed";
        String requestUrl = "/api/login";
        int expectedStatus = HttpServletResponse.SC_UNAUTHORIZED;

        when(request.getServletPath()).thenReturn(requestUrl);
        when(request.getRequestURL()).thenReturn(new StringBuffer("http://localhost/api/login"));
        when(authException.getMessage()).thenReturn(errorMessage);

        MockHttpServletResponse mockResponse = new MockHttpServletResponse();
        authEntryPointJwt.commence(request, mockResponse, authException);

        // Assert
        assertEquals(MediaType.APPLICATION_JSON_VALUE, mockResponse.getContentType());
        assertEquals(expectedStatus, mockResponse.getStatus());

        // Verify the JSON response body
        Map<String, Object> expectedBody = new HashMap<>();
        expectedBody.put("status", expectedStatus);
        expectedBody.put("error", "Unauthorized");
        expectedBody.put("message", errorMessage);
        expectedBody.put("path", requestUrl);

        ObjectMapper mapper = new ObjectMapper();
        String expectedJson = mapper.writeValueAsString(expectedBody);
        assertEquals(expectedJson, mockResponse.getContentAsString());
    }
}
