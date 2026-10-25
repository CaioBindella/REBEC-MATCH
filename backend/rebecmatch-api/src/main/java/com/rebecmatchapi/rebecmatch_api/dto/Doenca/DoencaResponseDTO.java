package com.rebecmatchapi.rebecmatch_api.dto.Doenca;

import lombok.Data;

@Data
public class DoencaResponseDTO {
    private Long id;
    private String codigo;
    private String nomeCientifico;
    private String nomePopular;
    private String vocabulario;
}
