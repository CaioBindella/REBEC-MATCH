package com.rebecmatchapi.rebecmatch_api.dto.Anuncio;

import lombok.Data;

import java.time.LocalDate;
@Data
public class AnuncioUpdateDTO {
    private String mensagem;
    private LocalDate dataExpiracao;
}
