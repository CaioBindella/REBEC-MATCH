package com.rebecmatchapi.rebecmatch_api.dto.Match;

import lombok.Data;

@Data
public class RespostaParaMatchDTO {
    private String conteudo;
    private QuestaoParaMatchDTO questao;
}