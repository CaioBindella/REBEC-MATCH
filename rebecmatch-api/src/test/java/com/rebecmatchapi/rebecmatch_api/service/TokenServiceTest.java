package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class TokenServiceTest {

    private static final String SEGREDO = "um-segredo-de-teste-com-mais-de-32-caracteres";

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {"asdfghjkl"})
    void naoIniciaSemSegredoForte(String segredo) {
        assertThatThrownBy(() -> new TokenService(segredo, 1)).isInstanceOf(IllegalStateException.class);
    }

    @Test
    void geraEValidaTokenDoUsuario() {
        TokenService service = new TokenService(SEGREDO, 1);
        Usuario usuario = new Usuario();
        usuario.setLogin("maria");

        String token = service.generateToken(usuario);

        assertThat(service.validateToken(token)).isEqualTo("maria");
    }

    @Test
    void rejeitaTokenAssinadoComOutroSegredoOuAdulterado() {
        Usuario usuario = new Usuario();
        usuario.setLogin("maria");
        String token = new TokenService("outro-segredo-qualquer-com-mais-de-32-caracteres", 1).generateToken(usuario);

        TokenService service = new TokenService(SEGREDO, 1);
        assertThat(service.validateToken(token)).isNull();
        assertThat(service.validateToken("token.invalido.qualquer")).isNull();
    }

    @Test
    void rejeitaTokenExpirado() {
        TokenService expirado = new TokenService(SEGREDO, -1);
        Usuario usuario = new Usuario();
        usuario.setLogin("maria");

        assertThat(expirado.validateToken(expirado.generateToken(usuario))).isNull();
    }
}
