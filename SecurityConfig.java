package com.example.student.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final String[] WHITE_LIST_URL = {
            "/swagger-ui.html",
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/webjars/**",
            "/favicon.ico"
    };

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // CSRF korumasını devre dışı bırak, çünkü REST API'ler genellikle bunu kullanmaz
            // ve JWT gibi token tabanlı kimlik doğrulama ile zaten korunurlar.
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(authorize -> authorize
                // Swagger UI ve OpenAPI dokümantasyon yollarına herkesin erişimine izin ver
                .requestMatchers(WHITE_LIST_URL).permitAll()
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
            .formLogin(AbstractHttpConfigurer::disable)
            // Oluşturduğumuz AuthenticationProvider'ı Spring Security'ye tanıtıyoruz.
            .authenticationProvider(authenticationProvider());
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        // Gerçek bir UserDetailsService'iniz olana kadar geçici bir tane kullanıyoruz.
        authProvider.setUserDetailsService(userDetailsService());
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        // Bu geçici bir çözümdür. Gerçek uygulamanızda, veritabanından kullanıcı
        // bilgilerini çeken bir UserDetailsService implementasyonu sağlamalısınız.
        return new InMemoryUserDetailsManager(
                User.withUsername("user").password(passwordEncoder().encode("password")).roles("USER").build()
        );
    }
}