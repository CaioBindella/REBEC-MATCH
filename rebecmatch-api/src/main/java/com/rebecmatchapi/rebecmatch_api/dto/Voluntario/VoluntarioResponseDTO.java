package com.rebecmatchapi.rebecmatch_api.dto.Voluntario;

import lombok.Data;

/**
 * Perfil pseudonimizado do voluntário: nunca expõe nome civil, e-mail, telefone ou documento.
 */
@Data
public class VoluntarioResponseDTO {
    private Integer id;
    private Integer usuarioId;
    private double distancia;
    private String nomeFicticio;
}
