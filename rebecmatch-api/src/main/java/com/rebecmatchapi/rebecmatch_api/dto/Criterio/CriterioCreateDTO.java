package com.rebecmatchapi.rebecmatch_api.dto.Criterio;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CriterioCreateDTO {
    @NotNull(message = "o estudo é obrigatório")
    @JsonProperty("estudo_id")
    private Integer estudoId;

    @JsonProperty("inclusion_criteria")
    private String inclusionCriteria;

    // Idades no formato ICTRP: número seguido da unidade (Y, M, W, D ou H). Ex.: "18Y", "6M".
    @JsonProperty("agemin")
    private String ageMin;

    @JsonProperty("agemax")
    private String ageMax;

    // Aceita FEMININO/MASCULINO/AMBOS ou os códigos ICTRP (F, M, -, B)
    private String gender;

    @JsonProperty("exclusion_criteria")
    private String exclusionCriteria;
}
