package com.example;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.example.entity.ERole;
import com.example.entity.Role;
import com.example.entity.User;
import com.example.repository.RoleRepository;
import com.example.repository.UserRepository;

@Component
public class DataLoader implements CommandLineRunner {

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  PasswordEncoder encoder;

  @Override
  public void run(String... args) throws Exception {
    // Create roles if they don't exist
    if (roleRepository.findByName(ERole.ROLE_USER).isEmpty()) {
      roleRepository.save(new Role(ERole.ROLE_USER));
    }
    if (roleRepository.findByName(ERole.ROLE_ADMIN).isEmpty()) {
      roleRepository.save(new Role(ERole.ROLE_ADMIN));
    }
    if (roleRepository.findByName(ERole.ROLE_MODERATOR).isEmpty()) {
      roleRepository.save(new Role(ERole.ROLE_MODERATOR));
    }

    // Create root user if it doesn't exist
    if (!userRepository.existsByUsername("root")) {
      User user = new User("root", "root@example.com", encoder.encode("root"));
      Set<Role> roles = new HashSet<>();
      Role adminRole = roleRepository.findByName(ERole.ROLE_ADMIN)
          .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
      roles.add(adminRole);
      user.setRoles(roles);
      userRepository.save(user);
    }
  }
}
