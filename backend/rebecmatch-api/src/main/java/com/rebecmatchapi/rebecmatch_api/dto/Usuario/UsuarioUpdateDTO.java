package com.rebecmatchapi.rebecmatch_api.dto.Usuario;

import com.rebecmatchapi.rebecmatch_api.entity.enums.Sexo;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

/**
 * Atualização dos dados cadastrais. A senha possui endpoint próprio (com validação da senha atual)
 * e o tipo de perfil não pode ser alterado depois do cadastro.
 */
@Data
public class UsuarioUpdateDTO {
    @Size(max = 50)
    private String nome;

    @Size(max = 50)
    private String sobrenome;

    @NotBlank(message = "o login é obrigatório")
    @Size(max = 50)
    private String login;

    @NotBlank(message = "o e-mail é obrigatório")
    @Email(message = "e-mail inválido")
    @Size(max = 100)
    private String email;

    private Sexo sexo;

    @Past(message = "a data de nascimento deve estar no passado")
    private LocalDate dataNascimento;

    @Size(max = 25)
    private String telefone;

    @Pattern(regexp = "^$|^[0-9]{8}$", message = "o CEP deve conter 8 dígitos")
    private String cep;

    @Size(max = 255)
    private String endereco;

    @Size(max = 25)
    private String documento;
}
