package com.rebecmatchapi.rebecmatch_api.dto.Match;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Afinidade entre o voluntário autenticado e um estudo em recrutamento: compatibilidade por idade e
 * sexo, proximidade geográfica e alertas de possível exclusão a partir do formulário de perfil.
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EstudoAfinidadeDTO {
    private Integer estudoId;
    private boolean compativel; // idade e sexo atendidos (ElegibilidadeService)
    private String uf; // UF do estudo, a partir do CEP do contato científico
    private boolean mesmaUf;
    private boolean mesmaRegiao;
    private List<String> alertas; // ex.: GESTACAO, TABAGISMO (AlertaExclusaoService)
}
