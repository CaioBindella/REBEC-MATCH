package com.rebecmatchapi.rebecmatch_api.service;

import org.springframework.stereotype.Service;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * Serviço de utilidade para manipulação e consulta de informações de CEP.
 */
@Service
public class CepService {

    // Usamos LinkedHashMap para garantir a ordem de verificação.
    private static final Map<Pattern, String> REGIOES_CEP = new LinkedHashMap<>();

    static {
        REGIOES_CEP.put(Pattern.compile("^([0][1-9][0-9]{3}|[1][0-9]{4})"), "SP"); // São Paulo
        REGIOES_CEP.put(Pattern.compile("^[2][0-8][0-9]{3}"), "RJ"); // Rio de Janeiro
        REGIOES_CEP.put(Pattern.compile("^[2][9][0-9]{3}"), "ES"); // Espírito Santo
        REGIOES_CEP.put(Pattern.compile("^[3][0-9]{4}"), "MG"); // Minas Gerais
        REGIOES_CEP.put(Pattern.compile("^[4][0-8][0-9]{3}"), "PR"); // Paraná
        REGIOES_CEP.put(Pattern.compile("^[4][9][0-9]{3}"), "SE"); // Sergipe
        REGIOES_CEP.put(Pattern.compile("^[5][0-6][0-9]{3}"), "PE"); // Pernambuco
        REGIOES_CEP.put(Pattern.compile("^[5][7][0-9]{3}"), "AL"); // Alagoas
        REGIOES_CEP.put(Pattern.compile("^[5][8][0-9]{3}"), "PB"); // Paraíba
        REGIOES_CEP.put(Pattern.compile("^[5][9][0-9]{3}"), "RN"); // Rio Grande do Norte
        REGIOES_CEP.put(Pattern.compile("^[6][0-3][0-9]{3}"), "CE"); // Ceará
        REGIOES_CEP.put(Pattern.compile("^[6][4][0-9]{3}"), "PI"); // Piauí
        REGIOES_CEP.put(Pattern.compile("^[6][5][0-9]{3}"), "MA"); // Maranhão
        REGIOES_CEP.put(Pattern.compile("^[6][6][0-9]{3}"), "PA"); // Pará
        REGIOES_CEP.put(Pattern.compile("^[6][8][0-9]{3}"), "AP"); // Amapá
        REGIOES_CEP.put(Pattern.compile("^[6][9][0-9]{3}"), "AM"); // Amazonas e RR
        REGIOES_CEP.put(Pattern.compile("^[7][0-6][0-9]{3}"), "DF"); // Distrito Federal, GO, TO, MT, MS, RO, AC
        REGIOES_CEP.put(Pattern.compile("^[7][7-9][0-9]{3}"), "BA"); // Bahia
        REGIOES_CEP.put(Pattern.compile("^[8][0-7][0-9]{3}"), "PR"); // Paraná
        REGIOES_CEP.put(Pattern.compile("^[8][8-9][0-9]{3}"), "SC"); // Santa Catarina
        REGIOES_CEP.put(Pattern.compile("^[9][0-9]{4}"), "RS"); // Rio Grande do Sul
    }

    /**
     * Obtém a sigla do estado com base no CEP fornecido.
     *
     * @param cep O CEP do usuário.
     * @return A sigla do estado (ex: "RJ", "SP") ou "BR" se não for encontrado.
     */
    public String getStateAbbreviation(String cep) {
        if (cep == null || cep.isBlank()) {
            return "BR"; // Retorna um valor padrão se o CEP for nulo ou vazio
        }
        String cepNumerico = cep.replaceAll("\\D", ""); // Remove caracteres não numéricos
        if (cepNumerico.length() < 5) {
            return "BR"; // CEP inválido
        }
        String cepPrefix = cepNumerico.substring(0, 5);

        for (Map.Entry<Pattern, String> entry : REGIOES_CEP.entrySet()) {
            if (entry.getKey().matcher(cepPrefix).matches()) {
                return entry.getValue();
            }
        }

        return "BR"; // Retorna padrão se nenhuma região corresponder
    }
}