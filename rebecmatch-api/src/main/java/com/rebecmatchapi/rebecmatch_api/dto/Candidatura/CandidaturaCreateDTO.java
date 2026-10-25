package com.rebecmatchapi.rebecmatch_api.dto.Candidatura;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Corpo da candidatura. O voluntário é identificado pelo token de autenticação,
 * nunca por um identificador enviado pelo cliente.
 */
@Data
public class CandidaturaCreateDTO {
    @NotNull(message = "o estudo é obrigatório")
    private Integer estudoId;
}
