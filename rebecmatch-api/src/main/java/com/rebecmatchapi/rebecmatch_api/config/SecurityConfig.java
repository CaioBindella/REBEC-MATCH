package com.rebecmatchapi.rebecmatch_api.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity // Ativa a configuração de segurança web do Spring
public class SecurityConfig {

    @Autowired
    SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                // Desativa a proteção CSRF, pois a autenticação via token já protege contra este ataque em APIs stateless.
                .csrf(csrf -> csrf.disable())
                // Configura a gestão de sessão para ser "stateless", ou seja, o servidor não guarda estado do utilizador. Cada requisição é independente.
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Define as regras de autorização para as requisições HTTP.
                .authorizeHttpRequests(authorize -> authorize
                        // Permite que qualquer pessoa faça uma requisição POST para o endpoint de login.
                        .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                        // Permite que qualquer pessoa faça uma requisição POST para criar um novo utilizador (registo).
                        .requestMatchers(HttpMethod.POST, "/api/v1/usuarios").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/match/dados").permitAll()// Trocar em produção
//                        .requestMatchers(HttpMethod.POST, "/api/v1/match/save").permitAll() // Trocar em produção
//                        .requestMatchers(HttpMethod.GET, "/api/v1/match/DadosFiltrados").permitAll() // Trocar em produção
                                // Para qualquer outra requisição, o utilizador precisa de estar autenticado.
                        .anyRequest().authenticated()
                )
                // Adiciona o nosso filtro de JWT para ser executado antes do filtro padrão de autenticação do Spring.
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }
}
