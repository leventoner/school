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
      // Removed verbose info logs for JWT parsing and validation result
      boolean isValid = jwt != null && jwtUtils.validateJwtToken(jwt);

      if (isValid) {
        String username = jwtUtils.getUserNameFromJwtToken(jwt);

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
