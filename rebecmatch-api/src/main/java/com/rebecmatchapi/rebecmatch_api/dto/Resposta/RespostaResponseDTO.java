package com.rebecmatchapi.rebecmatch_api.dto.Resposta;

import lombok.Data;
@Data
public class RespostaResponseDTO {
    private Integer id;
    private Integer voluntarioId;
    private Integer questaoId;
    private String conteudo;
    private boolean marcado;
    private String questaoTexto;
}
