package com.rebecmatchapi.rebecmatch_api.dto.Estudo;

import com.rebecmatchapi.rebecmatch_api.dto.Pesquisador.PesquisadorResponseDTO;
import lombok.Data;
import java.time.OffsetDateTime;

@Data
public class EstudoResponseDTO {
    private Integer id;
    private String titulo;
    // Para evitar loops, usamos um DTO de resposta para o pesquisador.
    // O ideal seria um DTO ainda mais simples, apenas com o ID e nome.
    private PesquisadorResponseDTO pesquisador;
    private String codigoRegistro;
    private String status;
    private OffsetDateTime dataInicio;
    private OffsetDateTime dataFim;
    private String informacoesGerais;
}