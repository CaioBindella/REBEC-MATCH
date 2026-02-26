package com.rebecmatchapi.rebecmatch_api.dto.Candidatura;

import lombok.Data;

@Data
public class CandidatoDetalhadoDTO {
    private Integer candidaturaId;
    private String voluntarioId;
    private String nomeFicticio;
    private int idade;
    private String sexo;
    private String localizacao;
    private String estudoTitulo;
    private String status;
    private String descricao;
    private Integer voluntarioIdReal;
    private Integer estudoId;
}