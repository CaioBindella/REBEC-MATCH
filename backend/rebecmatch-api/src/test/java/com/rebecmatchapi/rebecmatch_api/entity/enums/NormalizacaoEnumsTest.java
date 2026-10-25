package com.rebecmatchapi.rebecmatch_api.entity.enums;

import com.rebecmatchapi.rebecmatch_api.exception.BusinessException;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

class NormalizacaoEnumsTest {

    @ParameterizedTest
    @CsvSource({
            "F, FEMININO", "f, FEMININO", "Female, FEMININO", "FEMININO, FEMININO", "Feminino, FEMININO",
            "M, MASCULINO", "male, MASCULINO", "MASCULINO, MASCULINO",
            "-, AMBOS", "B, AMBOS", "Both, AMBOS", "AMBOS, AMBOS"
    })
    void normalizaCodigosDaIctrpEGrafiasDaAplicacao(String entrada, GeneroElegivel esperado) {
        assertThat(GeneroElegivel.normalizar(entrada)).isEqualTo(esperado);
    }

    @ParameterizedTest
    @NullAndEmptySource
    void generoAusenteSignificaSemRestricao(String entrada) {
        assertThat(GeneroElegivel.normalizar(entrada)).isEqualTo(GeneroElegivel.AMBOS);
    }

    @ParameterizedTest
    @CsvSource({
            "Recruiting, RECRUTANDO", "recruiting, RECRUTANDO", "RECRUTANDO, RECRUTANDO",
            "recruitment completed, RECRUTAMENTO_ENCERRADO", "Not yet recruiting, AINDA_NAO_RECRUTANDO",
            "data analysis completed, ANALISE_CONCLUIDA", "terminated, ENCERRADO", "other, OUTRO"
    })
    void normalizaStatusDeRecrutamentoIndependenteDaCaixa(String entrada, StatusRecrutamento esperado) {
        assertThat(StatusRecrutamento.deTexto(entrada)).isEqualTo(esperado);
    }

    @ParameterizedTest
    @ValueSource(strings = {"Em andamento", "xyz"})
    void statusDesconhecidoEhRejeitadoNoCadastroEViraOtherNaImportacao(String entrada) {
        assertThatThrownBy(() -> StatusRecrutamento.deTexto(entrada)).isInstanceOf(BusinessException.class);
        assertThat(StatusRecrutamento.deTextoOuOutro(entrada)).isEqualTo(StatusRecrutamento.OUTRO);
    }
}
