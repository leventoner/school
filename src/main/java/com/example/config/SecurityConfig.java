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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

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

  // CORS Configuration Bean
  @Bean
  public CorsConfigurationSource corsConfigurationSource() {
      CorsConfiguration configuration = new CorsConfiguration();
      configuration.setAllowedOrigins(java.util.Arrays.asList("http://localhost:3000")); // Allow frontend origin
      configuration.setAllowedMethods(java.util.Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
      configuration.setAllowedHeaders(java.util.Arrays.asList("*"));
      configuration.setExposedHeaders(java.util.Arrays.asList("Authorization")); // Expose Authorization header
      configuration.setAllowCredentials(true); // Allow credentials (cookies, authorization headers)
      configuration.setMaxAge(3600L); // Cache preflight response for 1 hour

      UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
      source.registerCorsConfiguration("/**", configuration); // Apply to all paths
      return source;
  }

  // CorsFilter Bean to apply CORS configuration
  @Bean
  public CorsFilter corsFilter() {
      return new CorsFilter(corsConfigurationSource());
  }
  
  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.csrf(csrf -> csrf.disable())
        .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> 
          auth.requestMatchers("/api/auth/**").permitAll()
              .requestMatchers("/api/test/**").permitAll()
              .anyRequest().authenticated()
        );
    
    http.authenticationProvider(authenticationProvider());

    // Add the CorsFilter before the AuthTokenFilter
    http.addFilterBefore(corsFilter(), CorsFilter.class); // Use CorsFilter here
    http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
    
    return http.build();
  }
}
