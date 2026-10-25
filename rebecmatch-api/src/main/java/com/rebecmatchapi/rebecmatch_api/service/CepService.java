package com.rebecmatchapi.rebecmatch_api.service;

import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Serviço de utilidade para obter a unidade federativa a partir do CEP, sem consulta externa,
 * com base nas faixas numéricas de CEP definidas pelos Correios (cinco primeiros dígitos).
 */
@Service
public class CepService {

    private record Faixa(int inicio, int fim, String uf) {
    }

    // Faixas pelos cinco primeiros dígitos do CEP; algumas UFs possuem mais de uma faixa.
    private static final List<Faixa> FAIXAS = List.of(
            new Faixa(1000, 19999, "SP"),
            new Faixa(20000, 28999, "RJ"),
            new Faixa(29000, 29999, "ES"),
            new Faixa(30000, 39999, "MG"),
            new Faixa(40000, 48999, "BA"),
            new Faixa(49000, 49999, "SE"),
            new Faixa(50000, 56999, "PE"),
            new Faixa(57000, 57999, "AL"),
            new Faixa(58000, 58999, "PB"),
            new Faixa(59000, 59999, "RN"),
            new Faixa(60000, 63999, "CE"),
            new Faixa(64000, 64999, "PI"),
            new Faixa(65000, 65999, "MA"),
            new Faixa(66000, 68899, "PA"),
            new Faixa(68900, 68999, "AP"),
            new Faixa(69000, 69299, "AM"),
            new Faixa(69300, 69399, "RR"),
            new Faixa(69400, 69899, "AM"),
            new Faixa(69900, 69999, "AC"),
            new Faixa(70000, 72799, "DF"),
            new Faixa(72800, 72999, "GO"),
            new Faixa(73000, 73699, "DF"),
            new Faixa(73700, 76799, "GO"),
            new Faixa(76800, 76999, "RO"),
            new Faixa(77000, 77999, "TO"),
            new Faixa(78000, 78899, "MT"),
            new Faixa(79000, 79999, "MS"),
            new Faixa(80000, 87999, "PR"),
            new Faixa(88000, 89999, "SC"),
            new Faixa(90000, 99999, "RS")
    );

    /**
     * Obtém a sigla do estado com base no CEP fornecido.
     *
     * @param cep O CEP do usuário (com ou sem hífen).
     * @return A sigla do estado (ex: "RJ", "SP") ou "BR" se o CEP for nulo, inválido ou fora das faixas.
     */
    public String getStateAbbreviation(String cep) {
        if (cep == null || cep.isBlank()) {
            return "BR";
        }
        String cepNumerico = cep.replaceAll("\\D", "");
        if (cepNumerico.length() < 5) {
            return "BR";
        }
        int prefixo = Integer.parseInt(cepNumerico.substring(0, 5));
        return FAIXAS.stream()
                .filter(f -> prefixo >= f.inicio() && prefixo <= f.fim())
                .map(Faixa::uf)
                .findFirst()
                .orElse("BR");
    }
}
