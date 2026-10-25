package com.rebecmatchapi.rebecmatch_api.dto.Usuario;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class ChangePasswordDTO {
    @NotBlank(message = "a senha atual é obrigatória")
    private String senhaAtual;

    @NotBlank(message = "a nova senha é obrigatória")
    @Size(min = 6, message = "a nova senha deve ter ao menos 6 caracteres")
    private String novaSenha;
}
