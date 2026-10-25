package com.rebecmatchapi.rebecmatch_api.dto.Voluntario;

import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

/**
 * O nome fictício é gerado pelo sistema (pseudonimização) e não pode ser alterado pelo usuário.
 */
@Data
public class VoluntarioUpdateDTO {
    @PositiveOrZero(message = "a distância deve ser maior ou igual a zero")
    private double distancia;
}
