package com.rebecmatchapi.rebecmatch_api.dto.Formulario;

import lombok.Data;

import java.time.LocalDate;

@Data
public class FormularioResponseDTO {
    private Integer id;
    private Integer estudoId; // Para simplicidade, retornamos apenas o ID do estudo.
    private String titulo;
    private String textoParaRespostaLivre;
    private LocalDate dataCriacao;
}
