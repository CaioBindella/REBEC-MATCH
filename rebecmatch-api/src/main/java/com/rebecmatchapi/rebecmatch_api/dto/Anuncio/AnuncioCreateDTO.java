package com.rebecmatchapi.rebecmatch_api.dto.Anuncio;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import java.time.OffsetDateTime;

@Data
public class AnuncioCreateDTO {
    @JsonProperty("busca_id")
    private Integer buscaId;
    private String mensagem;
    private OffsetDateTime dataExpiracao;
}
