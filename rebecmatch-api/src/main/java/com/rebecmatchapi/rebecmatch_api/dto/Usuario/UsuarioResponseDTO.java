package com.rebecmatchapi.rebecmatch_api.dto.Usuario;

import com.rebecmatchapi.rebecmatch_api.entity.enums.Sexo;
import com.rebecmatchapi.rebecmatch_api.entity.enums.TipoEspecifico;
import com.rebecmatchapi.rebecmatch_api.entity.enums.TipoUsuario;
import lombok.Data;

@Data
public class UsuarioResponseDTO {
    private Integer id;
    private String nome;
    private String sobrenome;
    private String login;
    private String email;
    private TipoUsuario tipo;
    private TipoEspecifico tipoEspecifico;
    private Sexo sexo;
    private boolean tester;
}
