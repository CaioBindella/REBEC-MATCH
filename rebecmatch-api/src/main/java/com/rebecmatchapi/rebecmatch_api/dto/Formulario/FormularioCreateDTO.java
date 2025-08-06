package com.rebecmatchapi.rebecmatch_api.dto.Formulario;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class FormularioCreateDTO {
    @JsonProperty("estudo_id")
    private Integer estudoId;
    private String titulo;
    private String textoParaRespostaLivre;
}