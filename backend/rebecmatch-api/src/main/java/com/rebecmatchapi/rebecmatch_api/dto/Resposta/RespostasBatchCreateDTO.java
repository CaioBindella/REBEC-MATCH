package com.rebecmatchapi.rebecmatch_api.dto.Resposta;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

/**
 * Envio, em uma única requisição, de todas as respostas de um formulário.
 * O voluntário é identificado pelo token de autenticação.
 */
@Data
public class RespostasBatchCreateDTO {
    @NotNull(message = "o formulário é obrigatório")
    @JsonProperty("formulario_id")
    private Integer formularioId;

    @NotEmpty(message = "envie ao menos uma resposta")
    @Valid
    private List<RespostaIndividualDTO> respostas;

    @Data
    public static class RespostaIndividualDTO {
        @NotNull(message = "a questão é obrigatória")
        @JsonProperty("questao_id")
        private Integer questaoId;

        private String conteudo;

        // Utilizado nas questões de múltipla escolha
        private boolean marcado = false;
    }
}
