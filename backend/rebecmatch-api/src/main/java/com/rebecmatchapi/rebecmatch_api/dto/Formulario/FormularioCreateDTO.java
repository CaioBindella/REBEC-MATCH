package com.rebecmatchapi.rebecmatch_api.dto.Formulario;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * Formulário específico de um estudo. O formulário global de perfil é criado pela migração V8.
 */
@Data
public class FormularioCreateDTO {
    @NotNull(message = "o estudo é obrigatório")
    @JsonProperty("estudo_id")
    private Integer estudoId;

    @NotBlank(message = "o título é obrigatório")
    private String titulo;

    private String textoParaRespostaLivre;
}
