package com.rebecmatchapi.rebecmatch_api.dto.Questao;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.rebecmatchapi.rebecmatch_api.entity.enums.TipoQuestao;
import lombok.Data;

@Data
public class QuestaoCreateDTO {
    @JsonProperty("formulario_id")
    private Integer formularioId;
    private String texto;
    private TipoQuestao tipo;
    private String opcoes; // Recebe o JSON como uma String
    private boolean obrigatorio;
}
