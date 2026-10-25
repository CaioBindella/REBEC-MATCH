package com.rebecmatchapi.rebecmatch_api.dto.Pesquisador;

import lombok.Data;

/**
 * Perfil público (pseudonimizado) do pesquisador: nunca expõe nome civil ou e-mail.
 */
@Data
public class PesquisadorResponseDTO {
    private Integer id;
    private Integer usuarioId;
    private String nomeFicticio;
}
