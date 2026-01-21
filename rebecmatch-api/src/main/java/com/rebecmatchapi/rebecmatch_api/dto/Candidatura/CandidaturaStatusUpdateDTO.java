package com.rebecmatchapi.rebecmatch_api.dto.Candidatura;

import com.rebecmatchapi.rebecmatch_api.entity.enums.StatusCandidatura;
import lombok.Data;

@Data
public class CandidaturaStatusUpdateDTO {
    private StatusCandidatura status;
}
