package com.rebecmatchapi.rebecmatch_api.integration;

import com.fasterxml.jackson.databind.JsonNode;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Percorre a máquina de estados da candidatura com confirmação em duas etapas, verificando as
 * transições válidas e inválidas, as notificações, o registro do match e o compartilhamento de dados.
 */
class FluxoCandidaturaIntegrationTest extends ApiTestSupport {

    @Test
    void fluxoCompletoDeCandidaturaComConfirmacaoMutua() throws Exception {
        Sessao pesquisador = pesquisador();
        Sessao outroPesquisador = pesquisador();
        Sessao voluntaria = voluntaria();

        int estudoId = criarEstudo(pesquisador, "recruiting", "Diabetes Mellitus tipo 2");
        criarCriterio(pesquisador, estudoId, "18Y", "65Y", "F");

        // A filtragem automática aponta o estudo como compatível (idade e sexo no mesmo domínio)
        assertThat(idsDe(get("/api/v1/match/estudos-compativeis"), voluntaria)).contains(estudoId);

        String candidatura = json.writeValueAsString(Map.of("estudoId", estudoId));

        // O formulário de perfil é pré-requisito da candidatura
        mvc.perform(autenticado(post("/api/v1/candidaturas"), voluntaria).contentType(MediaType.APPLICATION_JSON).content(candidatura))
                .andExpect(status().isConflict())
                .andExpect(jsonPath("$.message", containsString("formulário de perfil")));

        // Questão obrigatória sem resposta é rejeitada; um novo envio substitui o anterior
        String semResposta = json.writeValueAsString(Map.of("formulario_id", 1,
                "respostas", List.of(Map.of("questao_id", questaoDoPerfil(), "conteudo", " "))));
        mvc.perform(autenticado(post("/api/v1/respostas/batch"), voluntaria).contentType(MediaType.APPLICATION_JSON).content(semResposta))
                .andExpect(status().isBadRequest());
        preencherPerfil(voluntaria);
        preencherPerfil(voluntaria);
        mvc.perform(autenticado(get("/api/v1/respostas/usuario/" + voluntaria.usuarioId()), voluntaria))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));

        // Candidatura criada como PENDENTE; duplicidade e perfil errado são barrados
        JsonNode criada = json.readTree(mvc.perform(autenticado(post("/api/v1/candidaturas"), voluntaria)
                        .contentType(MediaType.APPLICATION_JSON).content(candidatura))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("PENDENTE"))
                .andExpect(jsonPath("$.voluntarioId").value(voluntaria.perfilId()))
                .andExpect(jsonPath("$.pesquisadorUsuarioId").value(pesquisador.usuarioId()))
                .andReturn().getResponse().getContentAsString());
        int candidaturaId = criada.get("id").asInt();
        mvc.perform(autenticado(post("/api/v1/candidaturas"), voluntaria).contentType(MediaType.APPLICATION_JSON).content(candidatura))
                .andExpect(status().isConflict());
        mvc.perform(autenticado(post("/api/v1/candidaturas"), pesquisador).contentType(MediaType.APPLICATION_JSON).content(candidatura))
                .andExpect(status().isForbidden());

        // Só o pesquisador responsável analisa e acessa as respostas do candidato
        mvc.perform(autenticado(patch("/api/v1/candidaturas/" + candidaturaId + "/analise-pesquisador"), outroPesquisador)
                        .contentType(MediaType.APPLICATION_JSON).content("true"))
                .andExpect(status().isForbidden());
        mvc.perform(autenticado(patch("/api/v1/candidaturas/" + candidaturaId + "/analise-pesquisador"), voluntaria)
                        .contentType(MediaType.APPLICATION_JSON).content("true"))
                .andExpect(status().isForbidden());
        mvc.perform(autenticado(get("/api/v1/respostas/voluntario/" + voluntaria.perfilId()), outroPesquisador))
                .andExpect(status().isForbidden());
        mvc.perform(autenticado(get("/api/v1/respostas/voluntario/" + voluntaria.perfilId()), pesquisador))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(1));

        // Lista de candidatos: apenas dados pseudonimizados
        String candidatos = mvc.perform(autenticado(get("/api/v1/candidaturas/pesquisador/" + pesquisador.perfilId()), pesquisador))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].nomeFicticio", containsString("VOL")))
                .andExpect(jsonPath("$[0].localizacao").value("28625"))
                .andExpect(jsonPath("$[0].sexo").value("FEMININO"))
                .andReturn().getResponse().getContentAsString();
        assertThat(candidatos).doesNotContain(voluntaria.email(), "Civil", "123.456.789-00", "21999990000");

        // O voluntário não confirma antes da aprovação do pesquisador
        mvc.perform(autenticado(patch("/api/v1/candidaturas/" + candidaturaId + "/confirmacao-voluntario"), voluntaria)
                        .contentType(MediaType.APPLICATION_JSON).content("true"))
                .andExpect(status().isConflict());

        // Aprovação do pesquisador; reanálise é rejeitada
        mvc.perform(autenticado(patch("/api/v1/candidaturas/" + candidaturaId + "/analise-pesquisador"), pesquisador)
                        .contentType(MediaType.APPLICATION_JSON).content("true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ACEITO_PELO_PESQUISADOR"));
        mvc.perform(autenticado(patch("/api/v1/candidaturas/" + candidaturaId + "/analise-pesquisador"), pesquisador)
                        .contentType(MediaType.APPLICATION_JSON).content("false"))
                .andExpect(status().isConflict());

        // Confirmação do voluntário conclui a candidatura e gera o match
        mvc.perform(autenticado(patch("/api/v1/candidaturas/" + candidaturaId + "/confirmacao-voluntario"), voluntaria)
                        .contentType(MediaType.APPLICATION_JSON).content("true"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONCLUIDO"));

        JsonNode matches = json.readTree(mvc.perform(autenticado(get("/api/v1/match"), voluntaria))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString());
        assertThat(matches).hasSize(1);
        assertThat(matches.get(0).get("estudoId").asInt()).isEqualTo(estudoId);
        assertThat(matches.get(0).get("criteriosAtendidos").asInt()).isEqualTo(3);
        assertThat(matches.get(0).get("pesquisadorUsuarioId").asInt()).isEqualTo(pesquisador.usuarioId());
        int matchId = matches.get(0).get("id").asInt();
        mvc.perform(autenticado(get("/api/v1/match/" + matchId), pesquisador)).andExpect(status().isOk());
        mvc.perform(autenticado(get("/api/v1/match/" + matchId), outroPesquisador)).andExpect(status().isForbidden());

        // Notificações em cada transição, visíveis apenas ao destinatário
        assertThat(titulosDasNotificacoes(voluntaria))
                .contains("Candidatura Enviada", "Candidatura Aprovada", "Match Confirmado");
        assertThat(titulosDasNotificacoes(pesquisador))
                .contains("Novo Candidato", "Participação Confirmada");
        mvc.perform(autenticado(get("/api/v1/notificacoes/usuario/" + pesquisador.usuarioId()), voluntaria))
                .andExpect(status().isForbidden());
    }

    @Test
    void recusaDoPesquisadorEncerraACandidaturaENotificaOVoluntario() throws Exception {
        Sessao pesquisador = pesquisador();
        Sessao voluntaria = voluntaria();
        int estudoId = criarEstudo(pesquisador, "Recruiting", "Hipertensão arterial");
        criarCriterio(pesquisador, estudoId, "18Y", "", "-");
        preencherPerfil(voluntaria);

        int candidaturaId = json.readTree(mvc.perform(autenticado(post("/api/v1/candidaturas"), voluntaria)
                        .contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(Map.of("estudoId", estudoId))))
                .andExpect(status().isCreated()).andReturn().getResponse().getContentAsString()).get("id").asInt();

        mvc.perform(autenticado(patch("/api/v1/candidaturas/" + candidaturaId + "/analise-pesquisador"), pesquisador)
                        .contentType(MediaType.APPLICATION_JSON).content("false"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("RECUSADO"));
        mvc.perform(autenticado(patch("/api/v1/candidaturas/" + candidaturaId + "/confirmacao-voluntario"), voluntaria)
                        .contentType(MediaType.APPLICATION_JSON).content("true"))
                .andExpect(status().isConflict());

        assertThat(titulosDasNotificacoes(voluntaria)).contains("Candidatura Não Aprovada");
        mvc.perform(autenticado(get("/api/v1/match"), voluntaria))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void estudoForaDeRecrutamentoNaoAceitaCandidaturaNemApareceComoCompativel() throws Exception {
        Sessao pesquisador = pesquisador();
        Sessao voluntaria = voluntaria();
        int estudoId = criarEstudo(pesquisador, "Recruitment completed", "Asma");
        criarCriterio(pesquisador, estudoId, "18Y", "", "AMBOS");
        preencherPerfil(voluntaria);

        mvc.perform(autenticado(post("/api/v1/candidaturas"), voluntaria)
                        .contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(Map.of("estudoId", estudoId))))
                .andExpect(status().isConflict());
        assertThat(idsDe(get("/api/v1/match/estudos-compativeis"), voluntaria)).doesNotContain(estudoId);
    }

    @Test
    void restricaoDeSexoExcluiVoluntarioIncompativelDaFiltragem() throws Exception {
        Sessao pesquisador = pesquisador();
        Sessao voluntaria = voluntaria();
        int apenasHomens = criarEstudo(pesquisador, "Recruiting", "Câncer de próstata");
        criarCriterio(pesquisador, apenasHomens, "40Y", "", "M");
        int criancas = criarEstudo(pesquisador, "Recruiting", "Bronquiolite");
        criarCriterio(pesquisador, criancas, "0", "2Y", "B");

        assertThat(idsDe(get("/api/v1/match/estudos-compativeis"), voluntaria)).doesNotContain(apenasHomens, criancas);
    }

    @Test
    void buscaPorDoencaAlcancaOTextoLivreDeCondicaoDoEstudo() throws Exception {
        Sessao pesquisador = pesquisador();
        Sessao voluntaria = voluntaria();
        int estudoId = criarEstudo(pesquisador, "Recruiting", "Fibromialgia refratária");

        assertThat(idsDe(get("/api/v1/estudos/busca").param("termo", "fibromialgia"), voluntaria)).contains(estudoId);
        mvc.perform(autenticado(get("/api/v1/estudos/busca").param("termo", "fi"), voluntaria))
                .andExpect(status().isBadRequest());
    }

    private List<Integer> idsDe(org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder request, Sessao sessao) throws Exception {
        JsonNode lista = json.readTree(mvc.perform(autenticado(request, sessao))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString());
        List<Integer> ids = new ArrayList<>();
        lista.forEach(estudo -> ids.add(estudo.get("id").asInt()));
        return ids;
    }

    private List<String> titulosDasNotificacoes(Sessao sessao) throws Exception {
        JsonNode lista = json.readTree(mvc.perform(autenticado(get("/api/v1/notificacoes/usuario/" + sessao.usuarioId()), sessao))
                .andExpect(status().isOk()).andReturn().getResponse().getContentAsString());
        List<String> titulos = new ArrayList<>();
        lista.forEach(n -> titulos.add(n.get("titulo").asText()));
        return titulos;
    }
}
