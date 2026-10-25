package com.rebecmatchapi.rebecmatch_api.dto.Candidatura;

import com.rebecmatchapi.rebecmatch_api.entity.enums.StatusCandidatura;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CandidaturaResponseDTO {
    private Integer id;
    private Integer voluntarioId;          // id do perfil Voluntario
    private Integer voluntarioUsuarioId;   // id do Usuario do voluntário (usado pelo serviço de chat)
    private String voluntarioNome;         // nome fictício
    private Integer estudoId;
    private String estudoTitulo;
    private Integer pesquisadorId;         // id do perfil Pesquisador
    private Integer pesquisadorUsuarioId;  // id do Usuario do pesquisador (usado pelo serviço de chat)
    private String pesquisadorNomeFicticio;
    private StatusCandidatura status;
    private LocalDateTime dataCandidatura;
}
