package com.rebecmatchapi.rebecmatch_api.dto.Match;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class MatchResultCreateDTO {

    @JsonProperty("voluntario_id")
    private Integer voluntarioId;

    @JsonProperty("estudo_id")
    private Integer estudoId;

    @JsonProperty("criterios_atendidos")
    private int criteriosAtendidos;
}