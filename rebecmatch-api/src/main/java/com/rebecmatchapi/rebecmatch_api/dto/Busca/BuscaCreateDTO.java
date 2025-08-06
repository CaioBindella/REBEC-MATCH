package com.rebecmatchapi.rebecmatch_api.dto.Busca;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class BuscaCreateDTO {
    private String nome;
    @JsonProperty("pesquisador_id")
    private Integer pesquisadorId;
}
