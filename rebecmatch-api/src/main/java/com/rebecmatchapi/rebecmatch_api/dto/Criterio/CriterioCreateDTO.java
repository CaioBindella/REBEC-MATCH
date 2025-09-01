package com.rebecmatchapi.rebecmatch_api.dto.Criterio;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CriterioCreateDTO {

    @JsonProperty("estudo_id")
    private Integer estudoId;

    @JsonProperty("inclusion_criteria")
    private String inclusionCriteria;

    @JsonProperty("agemin")
    private String ageMin;

    @JsonProperty("agemax")
    private String ageMax;

    private String gender;

    @JsonProperty("exclusion_criteria")
    private String exclusionCriteria;
}