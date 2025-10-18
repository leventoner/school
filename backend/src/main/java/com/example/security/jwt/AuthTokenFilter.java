package com.example.security.jwt;

import java.io.IOException;

import org.springframework.lang.NonNull;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.security.services.UserDetailsServiceImpl;

public class AuthTokenFilter extends OncePerRequestFilter {
  @Autowired
  private JwtUtils jwtUtils;

  @Autowired
  private UserDetailsServiceImpl userDetailsService;

  private static final Logger logger = LoggerFactory.getLogger(AuthTokenFilter.class);

  @Override
  protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
      throws ServletException, IOException {
    try {
      String jwt = parseJwt(request);
      logger.info("Request URL: {}", request.getRequestURL()); // Log the request URL
      logger.info("JWT Token: {}", jwt); // Log the extracted JWT token

      boolean isValid = false;
      if (jwt != null) {
          isValid = jwtUtils.validateJwtToken(jwt);
          logger.info("JWT Token validation result: {}", isValid); // Log validation result
      } else {
          logger.info("No JWT token found in the request.");
      }

      if (isValid) {
        String username = jwtUtils.getUserNameFromJwtToken(jwt);
        logger.info("Username from JWT: {}", username); // Log the username

        UserDetails userDetails = userDetailsService.loadUserByUsername(username);
        UsernamePasswordAuthenticationToken authentication =
            new UsernamePasswordAuthenticationToken(
                userDetails,
                null,
                userDetails.getAuthorities());
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

        SecurityContextHolder.getContext().setAuthentication(authentication);
      }
    } catch (Exception e) {
      logger.error("Cannot set user authentication: {}", e.getMessage(), e); // Added exception and message for better logging
    }

    filterChain.doFilter(request, response);
  }

  private String parseJwt(@NonNull HttpServletRequest request) {
    String headerAuth = request.getHeader("Authorization");
    // Removed verbose info log for raw header
    
    // Make the check case-insensitive for "Bearer "
    if (StringUtils.hasText(headerAuth) && headerAuth.toLowerCase().startsWith("bearer ")) {
      return headerAuth.substring(7);
    }

    return null;
  }
}
