package com.rebecmatchapi.rebecmatch_api.dto.Match;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class MatchResultResponseDTO {
    private Integer id;
    private Integer voluntarioId;
    private String voluntarioNomeFicticio;
    private Integer estudoId;
    private String estudoPublicTitle;
    private int criteriosAtendidos;
    private LocalDateTime dataMatch;
    private String justificativa;
}