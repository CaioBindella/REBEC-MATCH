package com.rebecmatchapi.rebecmatch_api.dto.Match;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * DTO Raiz para conter todos os dados para o match.
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
public class MatchDataDTO {
    private List<EstudoParaMatchDTO> estudos;
    private List<VoluntarioParaMatchDTO> voluntarios;
}