package com.rebecmatchapi.rebecmatch_api.dto.Candidatura;

import com.rebecmatchapi.rebecmatch_api.entity.enums.StatusCandidatura;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class CandidaturaResponseDTO {
    private Integer id;
    private Integer voluntarioId;
    private String voluntarioNome;
    private Integer estudoId;
    private String estudoTitulo;
    private StatusCandidatura status;
    private LocalDateTime dataCandidatura;
}
