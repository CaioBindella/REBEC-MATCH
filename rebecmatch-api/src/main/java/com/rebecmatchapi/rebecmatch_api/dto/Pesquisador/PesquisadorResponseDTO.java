package com.rebecmatchapi.rebecmatch_api.dto.Pesquisador;

import com.rebecmatchapi.rebecmatch_api.dto.Usuario.UsuarioResponseDTO;
import lombok.Data;

@Data
public class PesquisadorResponseDTO {
    private Integer id;
    private UsuarioResponseDTO usuario;
    private String nomeFicticio;
}
