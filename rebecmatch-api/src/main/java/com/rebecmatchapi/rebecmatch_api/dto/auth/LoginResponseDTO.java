package com.rebecmatchapi.rebecmatch_api.dto.auth;

import com.rebecmatchapi.rebecmatch_api.dto.Usuario.UsuarioResponseDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginResponseDTO {
    private String token;
    private UsuarioResponseDTO usuario;
    private String nomeFicticio;
    private Integer perfilId;
}