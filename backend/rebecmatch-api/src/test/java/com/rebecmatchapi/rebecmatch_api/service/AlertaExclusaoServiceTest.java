package com.rebecmatchapi.rebecmatch_api.service;

import static com.rebecmatchapi.rebecmatch_api.service.AlertaExclusaoService.ALERTA_GESTACAO;
import static com.rebecmatchapi.rebecmatch_api.service.AlertaExclusaoService.ALERTA_TABAGISMO;
import static com.rebecmatchapi.rebecmatch_api.service.AlertaExclusaoService.QUESTAO_FUMA;
import static com.rebecmatchapi.rebecmatch_api.service.AlertaExclusaoService.QUESTAO_GESTANTE;
import static org.assertj.core.api.Assertions.assertThat;

import com.rebecmatchapi.rebecmatch_api.entity.Criterio;
import com.rebecmatchapi.rebecmatch_api.entity.Questao;
import com.rebecmatchapi.rebecmatch_api.entity.Resposta;
import java.util.List;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;

class AlertaExclusaoServiceTest {

    private final AlertaExclusaoService service = new AlertaExclusaoService();

    private static final Map<Integer, String> GESTANTE =
            Map.of(QUESTAO_GESTANTE, "Sim", QUESTAO_FUMA, "Não");
    private static final Map<Integer, String> FUMANTE =
            Map.of(QUESTAO_GESTANTE, "Não", QUESTAO_FUMA, "Sim");

    @ParameterizedTest
    @ValueSource(
            strings = {
                "Pregnant or breastfeeding women",
                "Gestantes e lactantes",
                "Mulheres grávidas",
                "Pregnancy at screening",
                "Gestação em curso"
            })
    void gestanteRecebeAlertaQuandoAExclusaoMencionaGestacao(String exclusao) {
        assertThat(service.alertas(List.of(criterio(exclusao)), GESTANTE))
                .containsExactly(ALERTA_GESTACAO);
    }

    @ParameterizedTest
    @ValueSource(
            strings = {"Current smokers", "Tabagismo ativo", "Fumantes", "Use of tobacco products"})
    void fumanteRecebeAlertaQuandoAExclusaoMencionaTabagismo(String exclusao) {
        assertThat(service.alertas(List.of(criterio(exclusao)), FUMANTE))
                .containsExactly(ALERTA_TABAGISMO);
    }

    @Test
    void semAlertaQuandoARespostaNaoAtivaARegra() {
        Criterio criterio = criterio("Pregnant women; current smokers");

        assertThat(
                        service.alertas(
                                List.of(criterio),
                                Map.of(
                                        QUESTAO_GESTANTE,
                                        "Não",
                                        QUESTAO_FUMA,
                                        "Já fumou, mas parou")))
                .isEmpty();
        assertThat(service.alertas(List.of(criterio), Map.of())).isEmpty();
    }

    @Test
    void semAlertaQuandoAExclusaoNaoMencionaACondicao() {
        assertThat(service.alertas(List.of(criterio("Diabetes descompensado")), GESTANTE))
                .isEmpty();
        assertThat(service.alertas(List.of(criterio(null)), FUMANTE)).isEmpty();
        assertThat(service.alertas(List.of(), FUMANTE)).isEmpty();
    }

    @Test
    void consideraTodosOsCriteriosDoEstudoEAcumulaAlertas() {
        List<Criterio> criterios = List.of(criterio("Gestantes"), criterio("Smokers"));
        Map<Integer, String> gestanteEFumante =
                Map.of(QUESTAO_GESTANTE, "sim", QUESTAO_FUMA, " SIM ");

        assertThat(service.alertas(criterios, gestanteEFumante))
                .containsExactly(ALERTA_GESTACAO, ALERTA_TABAGISMO);
    }

    @Test
    void selecionaApenasAsRespostasUsadasPelasRegras() {
        List<Resposta> respostas =
                List.of(
                        resposta(QUESTAO_GESTANTE, "Sim"),
                        resposta(QUESTAO_FUMA, "Não"),
                        resposta(3, "Feminino"));

        assertThat(service.respostasRelevantes(respostas))
                .isEqualTo(Map.of(QUESTAO_GESTANTE, "Sim", QUESTAO_FUMA, "Não"));
    }

    private static Criterio criterio(String exclusao) {
        Criterio criterio = new Criterio();
        criterio.setExclusionCriteria(exclusao);
        return criterio;
    }

    private static Resposta resposta(int questaoId, String conteudo) {
        Questao questao = new Questao();
        questao.setId(questaoId);
        Resposta resposta = new Resposta();
        resposta.setQuestao(questao);
        resposta.setConteudo(conteudo);
        return resposta;
    }
}
