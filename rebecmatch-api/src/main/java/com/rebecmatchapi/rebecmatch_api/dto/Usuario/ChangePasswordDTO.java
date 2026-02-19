package com.rebecmatchapi.rebecmatch_api.dto.Usuario;

import lombok.Data;

@Data
public class ChangePasswordDTO {
    private String senhaAtual;
    private String novaSenha;
}
