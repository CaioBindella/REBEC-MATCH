package com.rebecmatchapi.rebecmatch_api.dto.Anuncio;

import lombok.Data;

import java.time.OffsetDateTime;
@Data
public class AnuncioUpdateDTO {
    private String mensagem;
    private OffsetDateTime dataExpiracao;
}
