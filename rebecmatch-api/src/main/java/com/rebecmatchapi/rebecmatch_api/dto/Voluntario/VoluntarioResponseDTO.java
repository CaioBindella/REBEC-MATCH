package com.rebecmatchapi.rebecmatch_api.dto.Voluntario;

import com.rebecmatchapi.rebecmatch_api.dto.Usuario.UsuarioResponseDTO;
import lombok.Data;

@Data
public class VoluntarioResponseDTO {
    private Integer id;
    private UsuarioResponseDTO usuario;
    private double distancia;
    private String nomeFicticio;
}
