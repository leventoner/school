package com.example.student.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // CSRF korumasını devre dışı bırak, çünkü REST API'ler genellikle bunu kullanmaz
            // ve JWT gibi token tabanlı kimlik doğrulama ile zaten korunurlar.
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(authorize -> authorize
                // Swagger UI ve OpenAPI dokümantasyon yollarına herkesin erişimine izin ver
                .requestMatchers(
                    "/swagger-ui.html",
                    "/swagger-ui/**",
                    "/v3/api-docs/**",
                    "/webjars/**", // Swagger UI'ın kullandığı statik kaynaklar için
                    "/favicon.ico" // Favicon için
                ).permitAll()
                // Diğer tüm istekler için kimlik doğrulama gerektir
                // Uygulamanızda JWT veya başka bir kimlik doğrulama mekanizması varsa,
                // bu kısmı uygulamanızın gereksinimlerine göre ayarlamanız gerekebilir.
                .anyRequest().authenticated()
            )
            // Oturum yönetimini durumsuz (stateless) olarak ayarla.
            // REST API'ler için her istek kendi kimlik bilgisini (örn. JWT) içermelidir.
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            // Varsayılan HTTP Basic ve Form Login'i devre dışı bırak
            .httpBasic(AbstractHttpConfigurer::disable)
            .formLogin(AbstractHttpConfigurer::disable);
        return http.build();
    }
}