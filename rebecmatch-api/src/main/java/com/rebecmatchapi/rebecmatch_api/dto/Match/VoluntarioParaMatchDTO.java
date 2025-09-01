package com.rebecmatchapi.rebecmatch_api.dto.Match;

import lombok.Data;
import java.util.List;

@Data
public class VoluntarioParaMatchDTO {
    private int id;
    private String nomeFicticio;
    // Adicionar outros campos do voluntário/usuário se necessário
    // private String sexo;
    // private java.time.LocalDate dataNascimento;
    private List<RespostaParaMatchDTO> respostas;
}