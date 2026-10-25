package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.entity.Criterio;
import com.rebecmatchapi.rebecmatch_api.entity.enums.GeneroElegivel;
import com.rebecmatchapi.rebecmatch_api.entity.enums.Sexo;
import com.rebecmatchapi.rebecmatch_api.service.ElegibilidadeService.LimiteIdade;
import com.rebecmatchapi.rebecmatch_api.service.ElegibilidadeService.ResultadoElegibilidade;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class ElegibilidadeServiceTest {

    private static final LocalDate HOJE = LocalDate.of(2026, 10, 25);

    private final ElegibilidadeService service = new ElegibilidadeService();

    @ParameterizedTest
    @CsvSource({
            "18Y, 18, YEARS",
            "65y, 65, YEARS",
            "6M, 6, MONTHS",
            "2W, 2, WEEKS",
            "28D, 28, DAYS",
            "72H, 72, HOURS",
            "40, 40, YEARS",       // número sem unidade: anos
            "' 18 Y ', 18, YEARS"
    })
    void interpretaTodasAsUnidadesDoExtrato(String texto, long valor, ChronoUnit unidade) {
        assertThat(service.interpretarIdade(texto)).contains(new LimiteIdade(valor, unidade));
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {"0", "0Y", "0M", "0D", "0W", "0H", "   "})
    void campoVazioOuZeroSignificaSemLimite(String texto) {
        assertThat(service.interpretarIdade(texto)).isEmpty();
    }

    @ParameterizedTest
    @ValueSource(strings = {"dezoito", "18X", "-5Y", "18.5Y"})
    void rejeitaFormatosNaoReconhecidos(String texto) {
        assertThatThrownBy(() -> service.interpretarIdade(texto)).isInstanceOf(IllegalArgumentException.class);
        assertThat(service.idadeValida(texto)).isFalse();
    }

    @Test
    void voluntarioDentroDaFaixaEtariaEComSexoAceitoEhElegivel() {
        Criterio criterio = criterio("18Y", "65Y", GeneroElegivel.FEMININO);

        ResultadoElegibilidade resultado = service.avaliar(criterio, LocalDate.of(1990, 5, 1), Sexo.FEMININO, HOJE);

        assertThat(resultado.elegivel()).isTrue();
        assertThat(resultado.criteriosAtendidos()).isEqualTo(3);
    }

    @Test
    void restricaoDeSexoEhComparadaNoMesmoDominioDoEnum() {
        Criterio apenasMulheres = criterio("18Y", "", GeneroElegivel.normalizar("F"));

        assertThat(service.avaliar(apenasMulheres, LocalDate.of(1990, 1, 1), Sexo.FEMININO, HOJE).elegivel()).isTrue();
        assertThat(service.avaliar(apenasMulheres, LocalDate.of(1990, 1, 1), Sexo.MASCULINO, HOJE).elegivel()).isFalse();
    }

    @Test
    void ambasAsGrafiasDeSemRestricaoAceitamQualquerSexo() {
        for (String codigo : List.of("-", "B")) {
            Criterio criterio = criterio("18Y", "", GeneroElegivel.normalizar(codigo));
            for (Sexo sexo : Sexo.values()) {
                assertThat(service.avaliar(criterio, LocalDate.of(1990, 1, 1), sexo, HOJE).sexo()).isTrue();
            }
        }
    }

    @Test
    void limiteZeroSemUnidadeNaoExcluiNinguem() {
        Criterio criterio = criterio("0", "0", GeneroElegivel.AMBOS);

        assertThat(service.avaliar(criterio, LocalDate.of(1940, 1, 1), Sexo.MASCULINO, HOJE).elegivel()).isTrue();
        assertThat(service.avaliar(criterio, LocalDate.of(2026, 1, 1), Sexo.MASCULINO, HOJE).elegivel()).isTrue();
    }

    @Test
    void limitesSaoInclusivos() {
        Criterio criterio = criterio("18Y", "65Y", GeneroElegivel.AMBOS);

        assertThat(service.avaliar(criterio, HOJE.minusYears(18), Sexo.OUTRO, HOJE).elegivel()).isTrue();
        assertThat(service.avaliar(criterio, HOJE.minusYears(18).plusDays(1), Sexo.OUTRO, HOJE).idadeMinima()).isFalse();
        assertThat(service.avaliar(criterio, HOJE.minusYears(66).plusDays(1), Sexo.OUTRO, HOJE).idadeMaxima()).isTrue();
        assertThat(service.avaliar(criterio, HOJE.minusYears(66), Sexo.OUTRO, HOJE).idadeMaxima()).isFalse();
    }

    @Test
    void limitesEmMesesSemanasDiasEHorasUsamCalendario() {
        LocalDate nascimento = HOJE.minusDays(10);

        assertThat(service.avaliar(criterio("1W", "2W", GeneroElegivel.AMBOS), nascimento, Sexo.FEMININO, HOJE).elegivel()).isTrue();
        assertThat(service.avaliar(criterio("0D", "28D", GeneroElegivel.AMBOS), nascimento, Sexo.FEMININO, HOJE).elegivel()).isTrue();
        assertThat(service.avaliar(criterio("1M", "", GeneroElegivel.AMBOS), nascimento, Sexo.FEMININO, HOJE).elegivel()).isFalse();
        assertThat(service.avaliar(criterio("", "48H", GeneroElegivel.AMBOS), nascimento, Sexo.FEMININO, HOJE).elegivel()).isFalse();
    }

    @Test
    void semDataDeNascimentoNaoAtendeLimiteEtarioExistente() {
        ResultadoElegibilidade resultado = service.avaliar(criterio("18Y", "", GeneroElegivel.AMBOS), null, Sexo.FEMININO, HOJE);

        assertThat(resultado.idadeMinima()).isFalse();
        assertThat(resultado.idadeMaxima()).isTrue();
        assertThat(resultado.elegivel()).isFalse();
    }

    @Test
    void limiteEmFormatoInvalidoProduzFalsoNegativo() {
        assertThat(service.avaliar(criterio("abc", "", GeneroElegivel.AMBOS), LocalDate.of(1990, 1, 1), Sexo.FEMININO, HOJE).elegivel()).isFalse();
    }

    @Test
    void estudoSemCriteriosNaoProduzResultadoEPrevaleceOMelhorCriterio() {
        assertThat(service.melhorResultado(List.of(), LocalDate.of(1990, 1, 1), Sexo.FEMININO, HOJE)).isEmpty();
        assertThat(service.melhorResultado(null, LocalDate.of(1990, 1, 1), Sexo.FEMININO, HOJE)).isEmpty();

        List<Criterio> criterios = List.of(
                criterio("70Y", "", GeneroElegivel.MASCULINO),
                criterio("18Y", "65Y", GeneroElegivel.AMBOS));

        assertThat(service.melhorResultado(criterios, LocalDate.of(1990, 1, 1), Sexo.FEMININO, HOJE))
                .hasValueSatisfying(r -> assertThat(r.elegivel()).isTrue());
    }

    private static Criterio criterio(String idadeMin, String idadeMax, GeneroElegivel genero) {
        Criterio criterio = new Criterio();
        criterio.setAgeMin(idadeMin);
        criterio.setAgeMax(idadeMax);
        criterio.setGender(genero);
        return criterio;
    }
}
