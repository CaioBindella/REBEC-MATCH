package com.rebecmatchapi.rebecmatch_api.dto.Match;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class MatchResultResponseDTO {
    private Integer id;
    private Integer voluntarioId;
    private Integer voluntarioUsuarioId;   // id do Usuario do voluntário (usado pelo serviço de chat)
    private String voluntarioNomeFicticio;
    private Integer estudoId;
    private String estudoPublicTitle;
    private Integer pesquisadorUsuarioId;  // id do Usuario do pesquisador (usado pelo serviço de chat)
    private String pesquisadorNomeFicticio;
    private int criteriosAtendidos;
    private LocalDateTime dataMatch;
    private String justificativa;
}
