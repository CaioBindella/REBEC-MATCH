package com.rebecmatchapi.rebecmatch_api.dto.Criterio;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CriterioCreateDTO {
    @JsonProperty("busca_id")
    private Integer buscaId;
    private String texto;
}
