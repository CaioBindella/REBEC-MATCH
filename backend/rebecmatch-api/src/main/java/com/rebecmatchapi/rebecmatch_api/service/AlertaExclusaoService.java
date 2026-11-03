package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.entity.Criterio;
import com.rebecmatchapi.rebecmatch_api.entity.Resposta;
import java.text.Normalizer;
import java.util.Collection;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.stream.Collectors;
import org.springframework.stereotype.Service;

/**
 * Alertas de possível exclusão: cruza respostas do formulário de perfil com termos do texto livre
 * dos critérios de exclusão de um estudo.
 *
 * <p>É uma regra determinística por palavras-chave, em português e em inglês. O alerta apenas avisa
 * o voluntário de que o estudo menciona a condição entre os critérios de exclusão; ele não remove o
 * estudo da lista nem decide a elegibilidade, que continua com o pesquisador.
 */
@Service
public class AlertaExclusaoService {

    // Questões do formulário de perfil (migração V8) usadas pelas regras
    static final int QUESTAO_FUMA = 25;
    static final int QUESTAO_GESTANTE = 27;

    public static final String ALERTA_GESTACAO = "GESTACAO";
    public static final String ALERTA_TABAGISMO = "TABAGISMO";

    private record Regra(String codigo, int questaoId, String respostaQueAtiva, Pattern termos) {}

    private static final List<Regra> REGRAS =
            List.of(
                    new Regra(
                            ALERTA_GESTACAO,
                            QUESTAO_GESTANTE,
                            "sim",
                            Pattern.compile("\\b(pregnan\\w*|gestante\\w*|gestacao|gravid\\w*)")),
                    new Regra(
                            ALERTA_TABAGISMO,
                            QUESTAO_FUMA,
                            "sim",
                            Pattern.compile(
                                    "\\b(smok\\w*|tabag\\w*|fumant\\w*|tobacco|cigar\\w*)")));

    /** Respostas do voluntário relevantes para as regras, indexadas pelo id da questão. */
    public Map<Integer, String> respostasRelevantes(Collection<Resposta> respostas) {
        return respostas.stream()
                .filter(r -> r.getQuestao() != null && r.getConteudo() != null)
                .filter(
                        r ->
                                REGRAS.stream()
                                        .anyMatch(
                                                regra ->
                                                        regra.questaoId()
                                                                == r.getQuestao().getId()))
                .collect(
                        Collectors.toMap(
                                r -> r.getQuestao().getId(), Resposta::getConteudo, (a, b) -> b));
    }

    /** Códigos dos alertas que se aplicam ao voluntário em algum dos critérios do estudo. */
    public List<String> alertas(Collection<Criterio> criterios, Map<Integer, String> respostas) {
        String exclusao =
                criterios == null
                        ? ""
                        : criterios.stream()
                                .map(Criterio::getExclusionCriteria)
                                .filter(t -> t != null && !t.isBlank())
                                .map(AlertaExclusaoService::normalizar)
                                .collect(Collectors.joining(" "));
        if (exclusao.isEmpty()) {
            return List.of();
        }
        return REGRAS.stream()
                .filter(
                        regra ->
                                regra.respostaQueAtiva()
                                        .equals(normalizar(respostas.get(regra.questaoId()))))
                .filter(regra -> regra.termos().matcher(exclusao).find())
                .map(Regra::codigo)
                .toList();
    }

    static String normalizar(String texto) {
        if (texto == null) {
            return "";
        }
        return Normalizer.normalize(texto.trim(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toLowerCase(Locale.ROOT);
    }
}
