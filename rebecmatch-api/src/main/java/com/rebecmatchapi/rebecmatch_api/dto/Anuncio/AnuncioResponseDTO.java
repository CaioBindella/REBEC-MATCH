package com.rebecmatchapi.rebecmatch_api.dto.Anuncio;

import lombok.Data;

import java.time.LocalDate;
@Data
public class AnuncioResponseDTO {
    private Integer id;
    private Integer buscaId;
    private String mensagem;
    private LocalDate dataExpiracao;
}
