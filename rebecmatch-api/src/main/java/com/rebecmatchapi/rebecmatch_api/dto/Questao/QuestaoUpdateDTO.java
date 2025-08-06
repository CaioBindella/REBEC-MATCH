package com.rebecmatchapi.rebecmatch_api.dto.Questao;

import com.rebecmatchapi.rebecmatch_api.entity.enums.TipoQuestao;
import lombok.Data;

@Data
public class QuestaoUpdateDTO {
    private String texto;
    private TipoQuestao tipo;
    private String opcoes;
    private boolean obrigatorio;
}
