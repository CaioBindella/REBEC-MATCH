package com.rebecmatchapi.rebecmatch_api.service;

import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.NullAndEmptySource;
import org.junit.jupiter.params.provider.ValueSource;

import static org.assertj.core.api.Assertions.assertThat;

class CepServiceTest {

    private final CepService service = new CepService();

    @ParameterizedTest
    @CsvSource({
            "01310-100, SP", "28625570, RJ", "29050-000, ES", "30130-100, MG", "40020-000, BA",
            "49010-000, SE", "50030-000, PE", "57020-000, AL", "58010-000, PB", "59010-000, RN",
            "60060-000, CE", "64000-000, PI", "65010-000, MA", "66010-000, PA", "68900-000, AP",
            "69010-000, AM", "69301-000, RR", "69900-000, AC", "70040-000, DF", "74003-010, GO",
            "76801-000, RO", "77001-000, TO", "78005-000, MT", "79002-000, MS", "80010-000, PR",
            "88010-000, SC", "90010-000, RS"
    })
    void identificaAUnidadeFederativaPelasFaixasDosCorreios(String cep, String uf) {
        assertThat(service.getStateAbbreviation(cep)).isEqualTo(uf);
    }

    @ParameterizedTest
    @NullAndEmptySource
    @ValueSource(strings = {"123", "00000-000", "abc"})
    void cepAusenteOuInvalidoRetornaBR(String cep) {
        assertThat(service.getStateAbbreviation(cep)).isEqualTo("BR");
    }
}
