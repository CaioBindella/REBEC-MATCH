package com.rebecmatchapi.rebecmatch_api.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.rebecmatchapi.rebecmatch_api.dto.Match.*;
import com.rebecmatchapi.rebecmatch_api.entity.*;
import com.rebecmatchapi.rebecmatch_api.exception.ResourceNotFoundException;
import com.rebecmatchapi.rebecmatch_api.repository.EstudoRepository;
import com.rebecmatchapi.rebecmatch_api.repository.MatchResultRepository;
import com.rebecmatchapi.rebecmatch_api.repository.RespostaRepository;
import com.rebecmatchapi.rebecmatch_api.repository.VoluntarioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MatchService {

    private final EstudoRepository estudoRepository;
    private final VoluntarioRepository voluntarioRepository;
    private final RespostaRepository respostaRepository;
    private final MatchResultRepository matchResultRepository;
    private final ObjectMapper objectMapper;
    private final WebClient.Builder webClientBuilder;

    @Value("${openai.ai.key}")
    private String openAiKey;
    @Value("${openai.api.url}")
    private String openAiApiUrl;

    @Transactional
    public List<MatchResult> executarMatchComOpenAIEstruturado(String promptUsuario) {
        // Gerando os dados
        MatchDataDTO dadosParaMatch = gerarDadosParaMatch();
        String dadosJson;
        try {
            dadosJson = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(dadosParaMatch);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Erro ao serializar dados para JSON", e);
        }

        // Contruindo o prompt para obter uma resposta ESTRUTURADA
        String promptCompleto = construirPromptEstruturado(promptUsuario, dadosJson);

        // Configuração da requisição para a OpenAI
        Map<String, Object> requestBody = Map.of(
                "model", "gpt-3.5-turbo",
                "response_format", Map.of("type", "json_object"), // Força a saída em JSON
                "messages", List.of(
                        Map.of("role", "system", "content", "Você é um assistente que retorna APENAS um objeto JSON válido baseado na análise do usuário."),
                        Map.of("role", "user", "content", promptCompleto)
                )
        );

        // Chamar a API
        WebClient webClient = webClientBuilder.build();
        String openAiResponse = webClient.post()
                .uri(openAiApiUrl)
                .header("Authorization", "Bearer " + openAiKey)
                .bodyValue(requestBody)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        // Extrair o conteúdo JSON da resposta
        String jsonResultado;
        try {
            Map<String, Object> responseMap = objectMapper.readValue(openAiResponse, Map.class);
            List<Map<String, Object>> choices = (List<Map<String, Object>>) responseMap.get("choices");
            Map<String, Object> message = (Map<String, Object>) choices.get(0).get("message");
            jsonResultado = (String) message.get("content");
        } catch (Exception e) {
            throw new RuntimeException("Erro ao extrair conteúdo da resposta da OpenAI: " + openAiResponse, e);
        }

        // Desserializar o JSON em uma lista de DTOs e salvar
        List<MatchResultCreateDTO> matchesDto = null;

        // Tenta analisar o JSON como um objeto com a chave "matches"
        try {
            Map<String, List<MatchResultCreateDTO>> resultMap =
                    objectMapper.readValue(jsonResultado, new TypeReference<Map<String, List<MatchResultCreateDTO>>>() {});
            matchesDto = resultMap.get("matches");
        } catch (Exception e) {
            // Se a primeira tentativa falhar, não faz nada, pois vamos tentar o segundo formato.
        }

        // Se o primeiro formato não funcionou (matchesDto ainda é nulo), tenta analisar como um array direto
        if (matchesDto == null) {
            try {
                matchesDto = objectMapper.readValue(jsonResultado, new TypeReference<List<MatchResultCreateDTO>>() {});
            } catch (Exception e) {
                // Se ambas as tentativas falharem, a resposta JSON é inválida.
                throw new RuntimeException("Erro ao desserializar a resposta da IA. O formato não é um objeto com a chave 'matches' nem um array direto. Resposta recebida: " + jsonResultado, e);
            }
        }

        // Se após as tentativas a lista for nula ou vazia, informa o erro.
        if (matchesDto == null) {
            throw new RuntimeException("A IA retornou um JSON nulo ou inválido. Resposta recebida: " + jsonResultado);
        }

        // Salva os resultados no banco de dados
        return matchesDto.stream()
                .map(this::saveMatchResult)
                .collect(Collectors.toList());

    }

    private String construirPromptEstruturado(String promptUsuario, String dadosJson) {
        return promptUsuario +
                "\n\n" +
                "Com base nos dados JSON fornecidos abaixo, gere as combinações. " +
                "Sua resposta DEVE ser um objeto JSON contendo uma única chave chamada 'matches'. " +
                "O valor dessa chave deve ser um array de objetos, onde cada objeto representa um match e contém EXATAMENTE as seguintes chaves: " +
                "'voluntario_id' (Integer), 'estudo_id' (Integer), 'criterios_atendidos' (Integer), e 'justificativa' (String, descrevendo brevemente por que o match foi feito e quais critérios foram importantes). " +
                "NÃO inclua nenhuma explicação, texto ou formatação fora deste objeto JSON." +
                "\n\nExemplo de formato de saída esperado:\n" +
                "{\n" +
                "  \"matches\": [\n" +
                "    {\n" +
                "      \"voluntario_id\": 101,\n" +
                "      \"estudo_id\": 22,\n" +
                "      \"criterios_atendidos\": 5,\n" +
                "      \"justificativa\": \"Voluntário atende aos critérios de idade e gênero, e suas respostas indicam compatibilidade com o foco do estudo em saúde mental.\"\n" +
                "    }\n" +
                "  ]\n" +
                "}\n\n" +
                "Agora, analise os seguintes dados:\n" +
                dadosJson;
    }

    @Transactional
    public MatchResult saveMatchResult(MatchResultCreateDTO dto) {
        Voluntario voluntario = voluntarioRepository.findById(dto.getVoluntarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Voluntário com ID " + dto.getVoluntarioId() + " não encontrado."));

        Estudo estudo = estudoRepository.findById(dto.getEstudoId())
                .orElseThrow(() -> new ResourceNotFoundException("Estudo com ID " + dto.getEstudoId() + " não encontrado."));

        MatchResult newMatch = new MatchResult();
        newMatch.setVoluntario(voluntario);
        newMatch.setEstudo(estudo);
        newMatch.setCriteriosAtendidos(dto.getCriteriosAtendidos());
        newMatch.setJustificativa(dto.getJustificativa());

        return matchResultRepository.save(newMatch);
    }


    public MatchDataDTO gerarDadosParaMatch() {
        List<EstudoParaMatchDTO> estudos = getEstudosParaMatch();
        List<VoluntarioParaMatchDTO> voluntarios = getVoluntariosParaMatch();

        return new MatchDataDTO(estudos, voluntarios);
    }


    public List<MatchResult> getAllMatchResults() {
        return matchResultRepository.findAll();
    }

    public MatchResult getMatchResultById(Integer id) {
        return matchResultRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Match com ID " + id + " não encontrado."));
    }

    private List<EstudoParaMatchDTO> getEstudosParaMatch() {
        // Supondo que "recrutando" é um status válido. Ajuste se necessário.
        List<Estudo> estudosAtivos = estudoRepository.findByRecruitmentStatus("Recruiting");

        return estudosAtivos.stream()
                .map(this::toEstudoParaMatchDTO)
                .collect(Collectors.toList());
    }

    private List<VoluntarioParaMatchDTO> getVoluntariosParaMatch() {
        List<Voluntario> todosVoluntarios = voluntarioRepository.findAll();

        return todosVoluntarios.stream()
                .map(this::toVoluntarioParaMatchDTO)
                .collect(Collectors.toList());
    }

    private EstudoParaMatchDTO toEstudoParaMatchDTO(Estudo estudo) {
        EstudoParaMatchDTO dto = new EstudoParaMatchDTO();
        dto.setId(estudo.getId());
        dto.setPublicTitle(estudo.getPublicTitle());
        dto.setScientificTitle(estudo.getScientificTitle());

        List<CriterioParaMatchDTO> criterios = estudo.getCriterios().stream()
                .map(this::toCriterioParaMatchDTO)
                .collect(Collectors.toList());
        dto.setCriterios(criterios);

        return dto;
    }

    private CriterioParaMatchDTO toCriterioParaMatchDTO(Criterio criterio) {
        CriterioParaMatchDTO dto = new CriterioParaMatchDTO();
        dto.setInclusionCriteria(criterio.getInclusionCriteria());
        dto.setExclusionCriteria(criterio.getExclusionCriteria());
        dto.setAgeMin(criterio.getAgeMin());
        dto.setAgeMax(criterio.getAgeMax());
        dto.setGender(criterio.getGender());
        return dto;
    }

    private VoluntarioParaMatchDTO toVoluntarioParaMatchDTO(Voluntario voluntario) {
        VoluntarioParaMatchDTO dto = new VoluntarioParaMatchDTO();
        dto.setId(voluntario.getId());
        dto.setNomeFicticio(voluntario.getNomeFicticio());
        // Mapear informações do usuário se necessário, ex:
        // dto.setDataNascimento(voluntario.getUsuario().getDataNascimento());
        // dto.setSexo(voluntario.getUsuario().getSexo().toString());

        List<Resposta> respostasDoVoluntario = respostaRepository.findByVoluntarioId(voluntario.getId());
        List<RespostaParaMatchDTO> respostasDTO = respostasDoVoluntario.stream()
                .map(this::toRespostaParaMatchDTO)
                .collect(Collectors.toList());
        dto.setRespostas(respostasDTO);

        return dto;
    }

    private RespostaParaMatchDTO toRespostaParaMatchDTO(Resposta resposta) {
        RespostaParaMatchDTO dto = new RespostaParaMatchDTO();
        dto.setConteudo(resposta.getConteudo());
        dto.setQuestao(toQuestaoParaMatchDTO(resposta.getQuestao()));
        return dto;
    }

    private QuestaoParaMatchDTO toQuestaoParaMatchDTO(Questao questao) {
        QuestaoParaMatchDTO dto = new QuestaoParaMatchDTO();
        dto.setId(questao.getId());
        dto.setTexto(questao.getTexto());
        return dto;
    }
}
