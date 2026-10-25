package com.rebecmatchapi.rebecmatch_api.entity.enums;

import java.text.Normalizer;

/**
 * Sexo aceito por um critério de elegibilidade, no mesmo domínio de valores do enum {@link Sexo}.
 * <p>
 * O extrato da ICTRP usa códigos de uma letra ("F", "M") e duas grafias para "sem restrição"
 * ("-" e "B", de <i>both</i>). Todos são convertidos para este enum no momento da importação ou do
 * cadastro, de modo que o banco armazena uma única representação.
 */
public enum GeneroElegivel {
    MASCULINO, FEMININO, AMBOS;

    /**
     * Converte qualquer grafia aceita (ICTRP, inglês ou português) para o domínio da aplicação.
     * Valores vazios ou desconhecidos são tratados como ausência de restrição.
     */
    public static GeneroElegivel normalizar(String valor) {
        if (valor == null) {
            return AMBOS;
        }
        String texto = Normalizer.normalize(valor.trim(), Normalizer.Form.NFD)
                .replaceAll("\\p{M}", "")
                .toUpperCase();
        return switch (texto) {
            case "F", "FEMALE", "FEMININO", "MULHER", "MULHERES" -> FEMININO;
            case "M", "MALE", "MASCULINO", "HOMEM", "HOMENS" -> MASCULINO;
            default -> AMBOS;
        };
    }

    /** Indica se uma pessoa do sexo informado atende a esta restrição. */
    public boolean aceita(Sexo sexo) {
        return switch (this) {
            case AMBOS -> true;
            case FEMININO -> sexo == Sexo.FEMININO;
            case MASCULINO -> sexo == Sexo.MASCULINO;
        };
    }
}
