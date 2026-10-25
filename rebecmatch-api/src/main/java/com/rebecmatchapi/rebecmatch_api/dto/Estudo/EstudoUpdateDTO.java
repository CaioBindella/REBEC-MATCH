package com.rebecmatchapi.rebecmatch_api.dto.Estudo;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EstudoUpdateDTO {
    @NotBlank(message = "o título público é obrigatório")
    private String publicTitle;

    @NotBlank(message = "o título científico é obrigatório")
    private String scientificTitle;

    @NotBlank(message = "o status de recrutamento é obrigatório")
    private String recruitmentStatus;

    private String studyType;
    private String phase;

    @NotNull(message = "a data de registro é obrigatória")
    private LocalDate dateRegistration;

    private LocalDate dateEnrolment;
    private String url;
    private String primarySponsor;
    private String hcFreetext;

    @JsonProperty("iFreetext")
    private String iFreetext;

    private String approvalDate;
    private String secId;

    @NotBlank(message = "o número de registro é obrigatório")
    private String trialId;
}
