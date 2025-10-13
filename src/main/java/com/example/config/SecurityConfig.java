package com.example.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod; // Import HttpMethod
import org.springframework.web.cors.CorsConfiguration; // Import CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource; // Import CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource; // Import UrlBasedCorsConfigurationSource
import java.util.List; // Import List

import com.example.security.jwt.AuthEntryPointJwt;
import com.example.security.jwt.AuthTokenFilter;
import com.example.security.services.UserDetailsServiceImpl;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {
  
  @Autowired
  UserDetailsServiceImpl userDetailsService;

  @Autowired
  private AuthEntryPointJwt unauthorizedHandler;

  @Bean
  public AuthTokenFilter authenticationJwtTokenFilter() {
    return new AuthTokenFilter();
  }
  
  @Bean
  public DaoAuthenticationProvider authenticationProvider() {
      DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
       
      authProvider.setUserDetailsService(userDetailsService);
      authProvider.setPasswordEncoder(passwordEncoder());
   
      return authProvider;
  }
  
  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
    return authConfig.getAuthenticationManager();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
  
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable())
        .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> 
          auth.requestMatchers("/api/auth/**").permitAll() // Allow public access for authentication endpoints
              .requestMatchers(HttpMethod.GET, "/", "/api/students").permitAll() // Allow public access for home and student list (GET)
              .requestMatchers(HttpMethod.GET, "/api/students/{id}").permitAll() // Allow public access for student details (GET)
              .requestMatchers(HttpMethod.POST, "/api/students").hasAnyRole("ADMIN", "MODERATOR") // Require ADMIN or MODERATOR role for adding students
              .requestMatchers(HttpMethod.PUT, "/api/students/{id}").hasAnyRole("ADMIN", "MODERATOR") // Require ADMIN or MODERATOR role for editing students
              .requestMatchers(HttpMethod.DELETE, "/api/students/{id}").hasAnyRole("ADMIN", "MODERATOR") // Require ADMIN or MODERATOR role for deleting students
              .anyRequest().authenticated() // All other requests require authentication
        );
    
    // Add CORS configuration
    http.cors(cors -> cors.configurationSource(corsConfigurationSource()));
    
    http.authenticationProvider(authenticationProvider());

    http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
    
    return http.build();
  }

  // Bean for CORS configuration
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    // Allow requests from the frontend origin (adjust port if necessary)
    configuration.setAllowedOrigins(List.of("http://localhost:3000")); 
    // Allowed HTTP methods
    configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS")); 
    // Allowed headers, including Authorization
    configuration.setAllowedHeaders(List.of("Authorization", "Content-Type")); 
    // Expose Authorization header to the frontend
    configuration.setExposedHeaders(List.of("Authorization")); 
    // Allow credentials (e.g., cookies, though not directly used for JWT here)
    configuration.setAllowCredentials(true); 
    // Cache preflight requests for 1 hour
    configuration.setMaxAge(3600L); 

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration); // Apply to all paths
    return source;
  }
}
