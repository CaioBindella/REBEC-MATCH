package com.rebecmatchapi.rebecmatch_api.dto.Match;

import lombok.Data;
import java.util.List;

@Data
public class EstudoParaMatchDTO {
    private int id;
    private String scientificTitle;
    private List<CriterioParaMatchDTO> criterios;
}
