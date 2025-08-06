package com.rebecmatchapi.rebecmatch_api.dto.Questao;

import com.rebecmatchapi.rebecmatch_api.entity.enums.TipoQuestao;
import lombok.Data;

@Data
public class QuestaoResponseDTO {
    private Integer id;
    private Integer formularioId;
    private String texto;
    private TipoQuestao tipo;
    private String opcoes; // Retorna o JSON como uma String
    private boolean obrigatorio;
}
