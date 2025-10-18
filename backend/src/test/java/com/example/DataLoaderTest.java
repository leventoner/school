package com.example;

import com.example.entity.ERole;
import com.example.entity.Role;
import com.example.entity.User;
import com.example.repository.RoleRepository;
import com.example.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.HashSet;
import java.util.Optional;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class DataLoaderTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RoleRepository roleRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private DataLoader dataLoader;

    @Test
    void run_shouldCreateRolesAndUser_whenTheyDontExist() throws Exception {
        // Arrange
        when(roleRepository.findByName(ERole.ROLE_USER)).thenReturn(Optional.empty());
        when(roleRepository.findByName(ERole.ROLE_MODERATOR)).thenReturn(Optional.empty());
        when(userRepository.existsByUsername("root")).thenReturn(false);
        when(passwordEncoder.encode("root")).thenReturn("encoded-root");
        
        // When save is called for the admin role, make findByName return it for the user creation part.
        Role adminRole = new Role(ERole.ROLE_ADMIN);
        // Return the role that is being saved. This handles all role types.
        when(roleRepository.save(any(Role.class))).thenAnswer(invocation -> invocation.getArgument(0));
        when(roleRepository.findByName(ERole.ROLE_ADMIN))
            .thenReturn(Optional.empty()) // First call returns empty
            .thenReturn(Optional.of(adminRole)); // Subsequent calls return the role

        // Act
        dataLoader.run();

        // Assert
        verify(roleRepository, times(3)).save(any(Role.class));
        verify(userRepository).save(argThat(user ->
                user.getUsername().equals("root") && user.getRoles().contains(adminRole)
        ));
    }

    @Test
    void run_shouldNotCreateRolesAndUser_whenTheyExist() throws Exception {
        // Arrange
        when(roleRepository.findByName(ERole.ROLE_USER)).thenReturn(Optional.of(new Role(ERole.ROLE_USER)));
        when(roleRepository.findByName(ERole.ROLE_ADMIN)).thenReturn(Optional.of(new Role(ERole.ROLE_ADMIN)));
        when(roleRepository.findByName(ERole.ROLE_MODERATOR)).thenReturn(Optional.of(new Role(ERole.ROLE_MODERATOR)));
        when(userRepository.existsByUsername("root")).thenReturn(true);

        // Act
        dataLoader.run();

        // Assert
        verify(roleRepository, never()).save(any(Role.class));
        verify(userRepository, never()).save(any(User.class));
    }
}
