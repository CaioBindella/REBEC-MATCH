package com.rebecmatchapi.rebecmatch_api.dto.Resposta;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Resposta individual. O voluntário é identificado pelo token de autenticação.
 */
@Data
public class RespostaCreateDTO {
    @NotNull(message = "a questão é obrigatória")
    @JsonProperty("questao_id")
    private Integer questaoId;

    private String conteudo;
    private boolean marcado;
}
