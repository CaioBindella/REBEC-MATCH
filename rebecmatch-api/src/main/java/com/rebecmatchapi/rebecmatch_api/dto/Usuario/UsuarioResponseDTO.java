package com.rebecmatchapi.rebecmatch_api.dto.Usuario;

import com.rebecmatchapi.rebecmatch_api.entity.enums.Sexo;
import com.rebecmatchapi.rebecmatch_api.entity.enums.TipoEspecifico;
import lombok.Data;

/**
 * Dados da própria conta, devolvidos apenas ao titular (login e consulta do perfil).
 */
@Data
public class UsuarioResponseDTO {
    private Integer id;
    private String nome;
    private String sobrenome;
    private String login;
    private String email;
    private TipoEspecifico tipoEspecifico;
    private Sexo sexo;
    private boolean tester;
}
