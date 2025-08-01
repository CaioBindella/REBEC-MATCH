package com.rebecmatchapi.rebecmatch_api.dto.Voluntario;

import lombok.Data;

@Data
public class VoluntarioCreateDTO {
    private Integer usuarioId;
    private double distancia;
    private String nomeFicticio;
}
