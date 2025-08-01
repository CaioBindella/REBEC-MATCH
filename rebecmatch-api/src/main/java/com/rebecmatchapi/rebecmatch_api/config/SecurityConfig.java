package com.rebecmatchapi.rebecmatch_api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // Passo 1: Desativa a proteção CSRF, que não é necessária para uma API REST stateless.
                .csrf(AbstractHttpConfigurer::disable)

                // Passo 2: Define as regras de autorização para os seus endpoints.
                .authorizeHttpRequests(authorize -> authorize
                        // Por agora, permite todas as requisições ("/**") sem autenticação.
                        // Isto é útil para testar os seus controllers sem se preocupar com segurança.
                        .requestMatchers("/**").permitAll()
                );
        return http.build();
    }
}
