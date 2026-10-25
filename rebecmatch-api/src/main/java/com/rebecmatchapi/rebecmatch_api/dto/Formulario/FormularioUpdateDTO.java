package com.rebecmatchapi.rebecmatch_api.dto.Formulario;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class FormularioUpdateDTO {
    @NotBlank(message = "o título é obrigatório")
    private String titulo;

    private String textoParaRespostaLivre;
}
