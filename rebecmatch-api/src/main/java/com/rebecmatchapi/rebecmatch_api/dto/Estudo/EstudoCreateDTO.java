package com.rebecmatchapi.rebecmatch_api.dto.Estudo;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.time.OffsetDateTime;

@Data
public class EstudoCreateDTO {
    private String titulo;
    @JsonProperty("pesquisador_id")
    private Integer pesquisadorId;
    private String codigoRegistro;
    private String status;
    private OffsetDateTime dataInicio;
    private OffsetDateTime dataFim;
    private String informacoesGerais;
}
