package com.example.security.services;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class UserDetailsImplTest {

    @Test
    void equals_shouldReturnTrueForSameObject() {
        List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
        UserDetailsImpl userDetails = new UserDetailsImpl(1L, "user", "user@example.com", "password", authorities);
        assertTrue(userDetails.equals(userDetails));
    }

    @Test
    void equals_shouldReturnFalseForNull() {
        List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
        UserDetailsImpl userDetails = new UserDetailsImpl(1L, "user", "user@example.com", "password", authorities);
        assertFalse(userDetails.equals(null));
    }

    @Test
    void equals_shouldReturnFalseForDifferentClass() {
        List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
        UserDetailsImpl userDetails = new UserDetailsImpl(1L, "user", "user@example.com", "password", authorities);
        assertFalse(userDetails.equals(new Object()));
    }

    @Test
    void equals_shouldReturnTrueForSameId() {
        List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
        UserDetailsImpl userDetails1 = new UserDetailsImpl(1L, "user1", "user1@example.com", "password", authorities);
        UserDetailsImpl userDetails2 = new UserDetailsImpl(1L, "user2", "user2@example.com", "password", authorities);
        assertTrue(userDetails1.equals(userDetails2));
    }

    @Test
    void equals_shouldReturnFalseForDifferentId() {
        List<GrantedAuthority> authorities = Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER"));
        UserDetailsImpl userDetails1 = new UserDetailsImpl(1L, "user1", "user1@example.com", "password", authorities);
        UserDetailsImpl userDetails2 = new UserDetailsImpl(2L, "user2", "user2@example.com", "password", authorities);
        assertFalse(userDetails1.equals(userDetails2));
    }
}
