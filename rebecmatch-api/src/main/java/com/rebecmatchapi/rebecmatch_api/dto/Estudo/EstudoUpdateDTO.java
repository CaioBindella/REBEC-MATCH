package com.rebecmatchapi.rebecmatch_api.dto.Estudo;

import lombok.Data;
import java.time.OffsetDateTime;

@Data
public class EstudoUpdateDTO {
    private String titulo;
    private String codigoRegistro;
    private String status;
    private OffsetDateTime dataInicio;
    private OffsetDateTime dataFim;
    private String informacoesGerais;
}
