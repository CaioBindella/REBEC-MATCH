package com.rebecmatchapi.rebecmatch_api.dto.Estudo;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.rebecmatchapi.rebecmatch_api.dto.Criterio.CriterioResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Pesquisador.PesquisadorResponseDTO;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class EstudoResponseDTO {
    private Integer id;
    private Integer pesquisadorId;
    private String publicTitle;
    private PesquisadorResponseDTO pesquisador;
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
    private List<CriterioResponseDTO> criterios;
    private List<String> nomesDoencas;
}