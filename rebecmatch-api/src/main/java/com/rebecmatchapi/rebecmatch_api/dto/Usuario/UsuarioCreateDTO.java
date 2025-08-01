package com.rebecmatchapi.rebecmatch_api.dto.Usuario;

import com.rebecmatchapi.rebecmatch_api.entity.enums.Sexo;
import com.rebecmatchapi.rebecmatch_api.entity.enums.TipoEspecifico;
import lombok.Data;

import java.time.OffsetDateTime;

@Data
public class UsuarioCreateDTO {
    private String nome;
    private String sobrenome;
    private String login;
    private String email;
    private String senha;
    private TipoEspecifico tipoEspecifico;
    private Sexo sexo;
    private OffsetDateTime dataNascimento;
    private String telefone;
    private String endereco;
    private String documento;
}
