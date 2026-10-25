package com.rebecmatchapi.rebecmatch_api.integration;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rebecmatchapi.rebecmatch_api.entity.Formulario;
import com.rebecmatchapi.rebecmatch_api.entity.Questao;
import com.rebecmatchapi.rebecmatch_api.entity.enums.TipoQuestao;
import com.rebecmatchapi.rebecmatch_api.repository.FormularioRepository;
import com.rebecmatchapi.rebecmatch_api.repository.QuestaoRepository;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Base dos testes de integração: sobe a aplicação completa (segurança, serviços, JPA) sobre H2 e
 * exercita a API por HTTP com tokens reais.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
abstract class ApiTestSupport {

    @Autowired
    protected MockMvc mvc;
    @Autowired
    protected ObjectMapper json;
    @Autowired
    protected JdbcTemplate jdbc;
    @Autowired
    protected FormularioRepository formularioRepository;
    @Autowired
    protected QuestaoRepository questaoRepository;

    protected record Sessao(String token, int usuarioId, int perfilId, String login, String email) {
    }

    /** Garante o formulário global de perfil (id 1) com uma questão obrigatória, como na migração V8. */
    @BeforeEach
    void garantirFormularioDePerfil() {
        if (!formularioRepository.existsById(Formulario.ID_FORMULARIO_PERFIL)) {
            jdbc.update("INSERT INTO formulario (id, titulo, data_criacao) VALUES (?, 'Formulário de Perfil Inicial', CURRENT_DATE)",
                    Formulario.ID_FORMULARIO_PERFIL);
        }
        if (questaoRepository.findByFormularioId(Formulario.ID_FORMULARIO_PERFIL).isEmpty()) {
            Questao questao = new Questao();
            questao.setFormulario(formularioRepository.getReferenceById(Formulario.ID_FORMULARIO_PERFIL));
            questao.setTexto("Data de nascimento");
            questao.setTipo(TipoQuestao.TEXTO);
            questao.setObrigatorio(true);
            questaoRepository.save(questao);
        }
    }

    protected Integer questaoDoPerfil() {
        return questaoRepository.findByFormularioId(Formulario.ID_FORMULARIO_PERFIL).get(0).getId();
    }

    protected Sessao voluntaria() throws Exception {
        return cadastrarELogar("VOLUNTARIO", "FEMININO", "1990-05-01", "28625570");
    }

    protected Sessao pesquisador() throws Exception {
        return cadastrarELogar("PESQUISADOR", null, null, "20040002");
    }

    protected Sessao cadastrarELogar(String tipo, String sexo, String nascimento, String cep) throws Exception {
        String sufixo = UUID.randomUUID().toString().substring(0, 8);
        String login = tipo.toLowerCase() + "_" + sufixo;
        String email = login + "@example.org";
        Map<String, Object> corpo = new LinkedHashMap<>();
        corpo.put("nome", "Nome");
        corpo.put("sobrenome", "Civil");
        corpo.put("login", login);
        corpo.put("email", email);
        corpo.put("senha", "senha123");
        corpo.put("tipoEspecifico", tipo);
        corpo.put("sexo", sexo);
        corpo.put("dataNascimento", nascimento);
        corpo.put("telefone", "21999990000");
        corpo.put("cep", cep);
        corpo.put("documento", "123.456.789-00");

        mvc.perform(post("/api/v1/usuarios").contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(corpo)))
                .andExpect(status().isCreated());

        JsonNode resposta = json.readTree(mvc.perform(post("/auth/login").contentType(MediaType.APPLICATION_JSON)
                        .content(json.writeValueAsString(Map.of("login", login, "senha", "senha123"))))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString());

        return new Sessao(resposta.get("token").asText(), resposta.get("usuario").get("id").asInt(),
                resposta.get("perfilId").asInt(), login, email);
    }

    protected int criarEstudo(Sessao pesquisador, String status, String condicao) throws Exception {
        Map<String, Object> corpo = new LinkedHashMap<>();
        corpo.put("publicTitle", "Estudo sobre " + condicao);
        corpo.put("scientificTitle", "Ensaio clínico randomizado sobre " + condicao);
        corpo.put("recruitmentStatus", status);
        corpo.put("studyType", "Intervention");
        corpo.put("phase", "3");
        corpo.put("dateRegistration", "2026-01-10");
        corpo.put("hcFreetext", condicao);
        corpo.put("iFreetext", "Intervenção de teste");
        corpo.put("trialId", "RBR-" + UUID.randomUUID().toString().substring(0, 6));

        JsonNode estudo = json.readTree(mvc.perform(autenticado(post("/api/v1/estudos"), pesquisador)
                        .contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(corpo)))
                .andExpect(status().isCreated())
                .andReturn().getResponse().getContentAsString());
        return estudo.get("id").asInt();
    }

    protected void criarCriterio(Sessao pesquisador, int estudoId, String idadeMin, String idadeMax, String genero) throws Exception {
        Map<String, Object> corpo = new LinkedHashMap<>();
        corpo.put("estudo_id", estudoId);
        corpo.put("inclusion_criteria", "Critérios de inclusão");
        corpo.put("exclusion_criteria", "Critérios de exclusão");
        corpo.put("agemin", idadeMin);
        corpo.put("agemax", idadeMax);
        corpo.put("gender", genero);
        mvc.perform(autenticado(post("/api/v1/criterios"), pesquisador)
                        .contentType(MediaType.APPLICATION_JSON).content(json.writeValueAsString(corpo)))
                .andExpect(status().isCreated());
    }

    protected void preencherPerfil(Sessao voluntario) throws Exception {
        String corpo = json.writeValueAsString(Map.of("formulario_id", Formulario.ID_FORMULARIO_PERFIL,
                "respostas", java.util.List.of(Map.of("questao_id", questaoDoPerfil(), "conteudo", "01/05/1990"))));
        mvc.perform(autenticado(post("/api/v1/respostas/batch"), voluntario)
                        .contentType(MediaType.APPLICATION_JSON).content(corpo))
                .andExpect(status().isCreated());
    }

    protected static MockHttpServletRequestBuilder autenticado(MockHttpServletRequestBuilder request, Sessao sessao) {
        return request.header("Authorization", "Bearer " + sessao.token());
    }
}
