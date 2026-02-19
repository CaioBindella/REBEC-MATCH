package com.rebecmatchapi.rebecmatch_api.dto.Estudo;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EstudoUpdateDTO {
    private Integer pesquisadorId;
    private String publicTitle;
    private String scientificTitle;
    private String recruitmentStatus;
    private String studyType;
    private String phase;
    private LocalDate dateRegistration;
    private LocalDate dateEnrolment;
    private String url;
    private String primarySponsor;
    private String hcFreetext;
    @JsonProperty("iFreetext")
    private String iFreetext;
    private String approvalDate;
    private String secId;
    private String trialId;
}
