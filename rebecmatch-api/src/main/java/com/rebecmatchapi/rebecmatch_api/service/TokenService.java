package com.rebecmatchapi.rebecmatch_api.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.Instant;

@Service
public class TokenService {

    private static final String ISSUER = "rebec-match-api";
    static final int TAMANHO_MINIMO_SEGREDO = 32;

    private final Algorithm algorithm;
    private final Duration validade;

    /**
     * O segredo é lido exclusivamente da variável de ambiente API_SECURITY_TOKEN_SECRET (via
     * application.properties). Não há valor padrão no código: sem um segredo forte a aplicação
     * não inicia.
     */
    public TokenService(@Value("${api.security.token.secret}") String secret,
                        @Value("${api.security.token.expiration-hours:1}") long horasDeValidade) {
        if (secret == null || secret.isBlank() || secret.length() < TAMANHO_MINIMO_SEGREDO) {
            throw new IllegalStateException("A variável API_SECURITY_TOKEN_SECRET deve ser definida com pelo menos "
                    + TAMANHO_MINIMO_SEGREDO + " caracteres.");
        }
        this.algorithm = Algorithm.HMAC256(secret);
        this.validade = Duration.ofHours(horasDeValidade);
    }

    public String generateToken(Usuario usuario) {
        try {
            Instant agora = Instant.now();
            return JWT.create()
                    .withIssuer(ISSUER)
                    .withSubject(usuario.getLogin())
                    .withIssuedAt(agora)
                    .withExpiresAt(agora.plus(validade))
                    .sign(algorithm);
        } catch (JWTCreationException exception) {
            throw new IllegalStateException("Erro ao gerar o token", exception);
        }
    }

    /**
     * Valida assinatura, emissor e expiração do token.
     *
     * @return o login do usuário (subject) ou {@code null} se o token for inválido ou expirado.
     */
    public String validateToken(String token) {
        try {
            return JWT.require(algorithm)
                    .withIssuer(ISSUER)
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException exception) {
            return null;
        }
    }
}
