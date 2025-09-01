package com.rebecmatchapi.rebecmatch_api.dto.Anuncio;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

import java.time.LocalDate;

@Data
public class AnuncioCreateDTO {
    @JsonProperty("busca_id")
    private Integer buscaId;
    private String mensagem;
    private LocalDate dataExpiracao;
}
