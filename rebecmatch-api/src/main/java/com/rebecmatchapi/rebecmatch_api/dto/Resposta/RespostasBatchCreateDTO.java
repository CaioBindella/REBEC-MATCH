package com.rebecmatchapi.rebecmatch_api.dto.Resposta;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.util.List;

@Data
public class RespostasBatchCreateDTO {

    @JsonProperty("voluntario_id")
    private Integer voluntarioId;

    @JsonProperty("formulario_id")
    private Integer formularioId;

    // Supondo que o frontend enviará as respostas para uma única busca por vez
    @JsonProperty("busca_id")
    private Integer buscaId;

    private List<RespostaIndividualDTO> respostas;

    @Data
    public static class RespostaIndividualDTO {
        @JsonProperty("questao_id")
        private Integer questaoId;

        private String conteudo;

        // Marcado pode ser opcional, dependendo da sua lógica de negócio
        private boolean marcado = false;
    }
}