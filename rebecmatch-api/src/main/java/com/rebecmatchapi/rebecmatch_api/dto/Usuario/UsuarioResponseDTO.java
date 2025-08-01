package com.rebecmatchapi.rebecmatch_api.dto.Usuario;

import com.rebecmatchapi.rebecmatch_api.entity.enums.Sexo;
import com.rebecmatchapi.rebecmatch_api.entity.enums.TipoEspecifico;
import com.rebecmatchapi.rebecmatch_api.entity.enums.TipoUsuario;
import lombok.Data;

import java.time.OffsetDateTime;

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
    private OffsetDateTime dataNascimento;
    private String telefone;
    private String endereco;
    private String documento;
    private boolean tester;
}
