package com.rebecmatchapi.rebecmatch_api.dto.Match;

import lombok.Data;

@Data
public class CriterioParaMatchDTO {
    private String inclusionCriteria;
    private String exclusionCriteria;
    private String ageMin;
    private String ageMax;
    private String gender;
}