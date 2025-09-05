package com.rebecmatchapi.rebecmatch_api.dto.Resposta;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class RespostaCreateDTO {
    @JsonProperty("voluntario_id")
    private Integer voluntarioId;
    @JsonProperty("questao_id")
    private Integer questaoId;
    private String conteudo;
    private boolean marcado;
}
