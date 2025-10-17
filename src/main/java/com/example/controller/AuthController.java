package com.example.controller;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.entity.User;
import com.example.payload.request.LoginRequest;
import com.example.payload.request.SignupRequest;
import com.example.payload.response.JwtResponse;
import com.example.payload.response.MessageResponse;
import com.example.repository.RoleRepository;
import com.example.repository.UserRepository;
import com.example.security.jwt.JwtUtils;
import com.example.security.services.UserDetailsImpl;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  @Autowired
  AuthenticationManager authenticationManager;

  @Autowired
  UserRepository userRepository;

  @Autowired
  RoleRepository roleRepository;

  @Autowired
  PasswordEncoder encoder;

  @Autowired
  JwtUtils jwtUtils;

  @PostMapping("/signin")
  public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {

    Authentication authentication = authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

    SecurityContextHolder.getContext().setAuthentication(authentication);
    String jwt = jwtUtils.generateJwtToken(authentication);
    
    UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();    
    List<String> roles = userDetails.getAuthorities().stream()
        .map(item -> item.getAuthority())
        .collect(Collectors.toList());

    // Returning JwtResponse with 'token' field
    return ResponseEntity.ok(new JwtResponse(jwt, 
                         userDetails.getId(), 
                         userDetails.getUsername(), 
                         userDetails.getEmail(), 
                         roles));
  }

  @PostMapping("/signup")
  public ResponseEntity<?> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
    if (userRepository.existsByUsername(signUpRequest.getUsername())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Username is already taken!"));
    }

    if (userRepository.existsByEmail(signUpRequest.getEmail())) {
      return ResponseEntity
          .badRequest()
          .body(new MessageResponse("Error: Email is already in use!"));
    }

    // Create new user's account
    User user = new User(signUpRequest.getUsername(), 
               signUpRequest.getEmail(),
               encoder.encode(signUpRequest.getPassword()));

    // Simplified role assignment logic
    Set<String> strRoles = signUpRequest.getRole();
    Set<com.example.entity.Role> roles = new HashSet<>();

    if (strRoles == null || strRoles.isEmpty()) {
        com.example.entity.Role userRole = roleRepository.findByName(com.example.entity.ERole.ROLE_USER)
            .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        roles.add(userRole);
    } else {
        strRoles.forEach(role -> {
            switch (role.toLowerCase()) { // Case-insensitive role matching
                case "admin":
                    roles.add(roleRepository.findByName(com.example.entity.ERole.ROLE_ADMIN).orElseThrow(() -> new RuntimeException("Error: Role is not found.")));
                    break;
                case "mod":
                    roles.add(roleRepository.findByName(com.example.entity.ERole.ROLE_MODERATOR).orElseThrow(() -> new RuntimeException("Error: Role is not found.")));
                    break;
                default: // Default to ROLE_USER if role is not recognized or empty
                    roles.add(roleRepository.findByName(com.example.entity.ERole.ROLE_USER).orElseThrow(() -> new RuntimeException("Error: Role is not found.")));
            }
        });
    }

    user.setRoles(roles);
    userRepository.save(user);

    return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
  }
}
