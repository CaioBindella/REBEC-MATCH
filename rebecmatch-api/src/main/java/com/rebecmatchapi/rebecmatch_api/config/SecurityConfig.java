package com.rebecmatchapi.rebecmatch_api.config;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;

@Configuration
@EnableWebSecurity // Ativa a configuração de segurança web do Spring
@RequiredArgsConstructor
public class SecurityConfig {

    private static final String VOLUNTARIO = "VOLUNTARIO";
    private static final String PESQUISADOR = "PESQUISADOR";

    private final SecurityFilter securityFilter;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .csrf(csrf -> csrf.disable())
                // Gestão de sessão "stateless": o servidor não guarda estado do usuário, cada requisição carrega seu token.
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Regras de acesso por perfil. A verificação de propriedade (ex.: o pesquisador dono do estudo)
                // é feita nas classes de serviço.
                .authorizeHttpRequests(authorize -> authorize
                        // Rotas públicas: login e cadastro de conta
                        .requestMatchers(HttpMethod.POST, "/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/usuarios").permitAll()

                        // Ações exclusivas do voluntário
                        .requestMatchers(HttpMethod.POST, "/api/v1/candidaturas").hasRole(VOLUNTARIO)
                        .requestMatchers(HttpMethod.PATCH, "/api/v1/candidaturas/*/confirmacao-voluntario").hasRole(VOLUNTARIO)
                        .requestMatchers("/api/v1/candidaturas/voluntario/**").hasRole(VOLUNTARIO)
                        .requestMatchers(HttpMethod.POST, "/api/v1/respostas/**").hasRole(VOLUNTARIO)
                        .requestMatchers(HttpMethod.PUT, "/api/v1/respostas/**").hasRole(VOLUNTARIO)
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/respostas/**").hasRole(VOLUNTARIO)
                        .requestMatchers(HttpMethod.PUT, "/api/v1/voluntarios/**").hasRole(VOLUNTARIO)
                        .requestMatchers("/api/v1/match/estudos-compativeis").hasRole(VOLUNTARIO)

                        // Ações exclusivas do pesquisador
                        .requestMatchers(HttpMethod.PATCH, "/api/v1/candidaturas/*/analise-pesquisador").hasRole(PESQUISADOR)
                        .requestMatchers("/api/v1/candidaturas/pesquisador/**", "/api/v1/candidaturas/estudo/**").hasRole(PESQUISADOR)
                        .requestMatchers(HttpMethod.POST, "/api/v1/estudos/**", "/api/v1/criterios/**",
                                "/api/v1/formularios/**", "/api/v1/questoes/**").hasRole(PESQUISADOR)
                        .requestMatchers(HttpMethod.PUT, "/api/v1/estudos/**", "/api/v1/criterios/**",
                                "/api/v1/formularios/**", "/api/v1/questoes/**").hasRole(PESQUISADOR)
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/estudos/**", "/api/v1/criterios/**",
                                "/api/v1/formularios/**", "/api/v1/questoes/**").hasRole(PESQUISADOR)

                        // Demais rotas (consulta de estudos, doenças, notificações, perfil etc.) exigem autenticação
                        .anyRequest().authenticated()
                )
                // 401 para token ausente, inválido ou expirado; 403 para perfil sem permissão
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, ex) -> escreverErro(response,
                                HttpServletResponse.SC_UNAUTHORIZED, "Autenticação necessária ou token expirado."))
                        .accessDeniedHandler((request, response, ex) -> escreverErro(response,
                                HttpServletResponse.SC_FORBIDDEN, "Seu perfil não tem permissão para esta operação."))
                )
                // Filtro de JWT executado antes do filtro padrão de autenticação do Spring.
                .addFilterBefore(securityFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    private static void escreverErro(HttpServletResponse response, int status, String mensagem) throws IOException {
        response.setStatus(status);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write("{\"status\":" + status + ",\"message\":\"" + mensagem + "\"}");
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
