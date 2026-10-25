package com.rebecmatchapi.rebecmatch_api.integration;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import java.util.LinkedHashMap;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Autenticação, autorização por perfil, propriedade dos recursos e minimização de dados expostos.
 */
class SegurancaIntegrationTest extends ApiTestSupport {

    @Test
    void rotasProtegidasExigemTokenValido() throws Exception {
        mvc.perform(get("/api/v1/estudos/recrutando")).andExpect(status().isUnauthorized());
        mvc.perform(get("/api/v1/estudos/recrutando").header("Authorization", "Bearer token-invalido"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void credenciaisInvalidasRetornam401() throws Exception {
        Sessao voluntaria = voluntaria();
        mvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(Map.of("login", voluntaria.login(), "senha", "errada"))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void rotaPublicaDeDadosParaMatchNaoExisteMais() throws Exception {
        Sessao voluntaria = voluntaria();
        mvc.perform(get("/api/v1/match/dados")).andExpect(status().isUnauthorized());
        mvc.perform(autenticado(get("/api/v1/match/dados"), voluntaria)).andExpect(status().isNotFound());
    }

    @Test
    void usuarioSoAcessaAPropriaConta() throws Exception {
        Sessao voluntaria = voluntaria();
        Sessao outra = voluntaria();
        mvc.perform(autenticado(get("/api/v1/usuarios/" + outra.usuarioId()), voluntaria)).andExpect(status().isForbidden());
        mvc.perform(autenticado(get("/api/v1/usuarios/" + voluntaria.usuarioId()), voluntaria))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value(voluntaria.email()));
        mvc.perform(autenticado(get("/api/v1/voluntarios/" + outra.perfilId()), voluntaria)).andExpect(status().isForbidden());
    }

    @Test
    void cadastroValidaDadosEUnicidade() throws Exception {
        Sessao existente = voluntaria();

        Map<String, Object> corpo = new LinkedHashMap<>();
        corpo.put("login", "novo_login_unico");
        corpo.put("email", existente.email());
        corpo.put("senha", "senha123");
        corpo.put("tipoEspecifico", "VOLUNTARIO");
        corpo.put("sexo", "MASCULINO");
        corpo.put("dataNascimento", "1985-03-02");
        mvc.perform(post("/api/v1/usuarios").contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(corpo)))
                .andExpect(status().isConflict());

        corpo.put("email", "email-invalido");
        mvc.perform(post("/api/v1/usuarios").contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(corpo)))
                .andExpect(status().isBadRequest());

        corpo.put("email", "voluntario.sem.nascimento@example.org");
        corpo.remove("dataNascimento");
        mvc.perform(post("/api/v1/usuarios").contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(corpo)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void alteracaoDeSenhaExigeASenhaAtualEMantemOLoginFuncionando() throws Exception {
        Sessao voluntaria = voluntaria();
        String url = "/api/v1/usuarios/" + voluntaria.usuarioId() + "/senha";

        mvc.perform(autenticado(put(url), voluntaria).contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(Map.of("senhaAtual", "incorreta", "novaSenha", "novaSenha456"))))
                .andExpect(status().isConflict());
        mvc.perform(autenticado(put(url), voluntaria).contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(Map.of("senhaAtual", "senha123", "novaSenha", "novaSenha456"))))
                .andExpect(status().isNoContent());

        // A atualização dos dados cadastrais não altera a senha
        Map<String, Object> dados = new LinkedHashMap<>();
        dados.put("login", voluntaria.login());
        dados.put("email", voluntaria.email());
        dados.put("sexo", "FEMININO");
        dados.put("dataNascimento", "1990-05-01");
        mvc.perform(autenticado(put("/api/v1/usuarios/" + voluntaria.usuarioId()), voluntaria)
                        .contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(dados)))
                .andExpect(status().isOk());

        mvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(Map.of("login", voluntaria.login(), "senha", "novaSenha456"))))
                .andExpect(status().isOk());
    }

    @Test
    void estudoSoEhGerenciadoPeloPesquisadorResponsavelENaoExpoeDadosCivis() throws Exception {
        Sessao pesquisador = pesquisador();
        Sessao outroPesquisador = pesquisador();
        Sessao voluntaria = voluntaria();
        int estudoId = criarEstudo(pesquisador, "Recruiting", "Lúpus");

        mvc.perform(autenticado(delete("/api/v1/estudos/" + estudoId), outroPesquisador)).andExpect(status().isForbidden());
        mvc.perform(autenticado(delete("/api/v1/estudos/" + estudoId), voluntaria)).andExpect(status().isForbidden());

        String estudo = mvc.perform(autenticado(get("/api/v1/estudos/" + estudoId), voluntaria))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.pesquisadorId").value(pesquisador.perfilId()))
                .andExpect(jsonPath("$.pesquisador.nomeFicticio").value(org.hamcrest.Matchers.startsWith("PS")))
                .andReturn().getResponse().getContentAsString();
        assertThat(estudo).doesNotContain(pesquisador.email(), "Civil");

        mvc.perform(autenticado(get("/api/v1/pesquisadores/" + pesquisador.perfilId()), voluntaria))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.usuario").doesNotExist());
    }

    @Test
    void criterioComIdadeInvalidaEhRejeitadoESexoEhNormalizado() throws Exception {
        Sessao pesquisador = pesquisador();
        int estudoId = criarEstudo(pesquisador, "Recruiting", "Obesidade");

        Map<String, Object> corpo = new LinkedHashMap<>();
        corpo.put("estudo_id", estudoId);
        corpo.put("agemin", "dezoito");
        corpo.put("agemax", "65Y");
        corpo.put("gender", "F");
        mvc.perform(autenticado(post("/api/v1/criterios"), pesquisador)
                        .contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(corpo)))
                .andExpect(status().isBadRequest());

        corpo.put("agemin", "18y");
        mvc.perform(autenticado(post("/api/v1/criterios"), pesquisador)
                        .contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(corpo)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.gender").value("FEMININO"))
                .andExpect(jsonPath("$.agemin").value("18Y"));
    }

    @Test
    void formularioGlobalDePerfilNaoPodeSerAlteradoPelaApi() throws Exception {
        Sessao pesquisador = pesquisador();
        mvc.perform(autenticado(delete("/api/v1/formularios/1"), pesquisador)).andExpect(status().isForbidden());
    }

    @Test
    void sugestoesDeDoencaExigemTresCaracteres() throws Exception {
        Sessao voluntaria = voluntaria();
        jdbc.update("INSERT INTO doencas (codigo, nome_cientifico, nome_popular, vocabulario) "
                + "SELECT 'C08.127.446', 'Asthma', 'Asma brônquica', 'DeCS' "
                + "WHERE NOT EXISTS (SELECT 1 FROM doencas WHERE codigo = 'C08.127.446')");

        mvc.perform(autenticado(get("/api/v1/doencas").param("termo", "as"), voluntaria)).andExpect(status().isBadRequest());
        mvc.perform(autenticado(get("/api/v1/doencas").param("termo", "asma"), voluntaria))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].codigo").value("C08.127.446"));
    }
}
