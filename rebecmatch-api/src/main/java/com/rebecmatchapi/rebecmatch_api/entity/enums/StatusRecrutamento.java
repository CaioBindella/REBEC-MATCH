package com.rebecmatchapi.rebecmatch_api.entity.enums;

import com.rebecmatchapi.rebecmatch_api.exception.BusinessException;

import java.util.Arrays;

/**
 * Status de recrutamento de um estudo, com os rótulos do padrão ICTRP gravados na coluna
 * {@code estudo.recruitment_status}. O extrato do ReBEC mistura maiúsculas e minúsculas
 * ("Recruiting" e "recruiting"); a normalização garante uma grafia única no banco.
 */
public enum StatusRecrutamento {
    RECRUTANDO("Recruiting"),
    AINDA_NAO_RECRUTANDO("Not yet recruiting"),
    RECRUTAMENTO_ENCERRADO("Recruitment completed"),
    ANALISE_CONCLUIDA("Data analysis completed"),
    SUSPENSO("Suspended"),
    ENCERRADO("Terminated"),
    RETIRADO("Withdrawn"),
    OUTRO("Other");

    private final String rotulo;

    StatusRecrutamento(String rotulo) {
        this.rotulo = rotulo;
    }

    public String getRotulo() {
        return rotulo;
    }

    /** Converte um texto livre (rótulo ICTRP em qualquer caixa ou nome do enum) para o status. */
    public static StatusRecrutamento deTexto(String texto) {
        if (texto == null || texto.isBlank()) {
            throw new BusinessException("O status de recrutamento é obrigatório.");
        }
        String valor = texto.trim();
        return Arrays.stream(values())
                .filter(s -> s.rotulo.equalsIgnoreCase(valor) || s.name().equalsIgnoreCase(valor))
                .findFirst()
                .orElseThrow(() -> new BusinessException("Status de recrutamento inválido: " + texto
                        + ". Valores aceitos: " + Arrays.toString(Arrays.stream(values()).map(s -> s.rotulo).toArray())));
    }

    /** Versão tolerante usada na importação: valores fora do padrão são registrados como "Other". */
    public static StatusRecrutamento deTextoOuOutro(String texto) {
        try {
            return deTexto(texto);
        } catch (BusinessException e) {
            return OUTRO;
        }
    }
}
