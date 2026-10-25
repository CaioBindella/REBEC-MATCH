package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.entity.Doenca;
import com.rebecmatchapi.rebecmatch_api.exception.BadRequestException;
import com.rebecmatchapi.rebecmatch_api.repository.DoencaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Consulta ao vocabulário controlado de condições de saúde (DeCS/CID-10), usada nas sugestões
 * automáticas da busca de estudos por doença.
 */
@Service
@RequiredArgsConstructor
public class DoencaService {

    private final DoencaRepository doencaRepository;

    @Transactional(readOnly = true)
    public List<Doenca> sugerir(String termo) {
        if (termo == null || termo.trim().length() < EstudoService.TAMANHO_MINIMO_BUSCA) {
            throw new BadRequestException("Informe ao menos " + EstudoService.TAMANHO_MINIMO_BUSCA + " caracteres para a busca.");
        }
        String busca = termo.trim();
        return doencaRepository.findTop20ByNomePopularContainingIgnoreCaseOrNomeCientificoContainingIgnoreCaseOrderByNomePopularAsc(busca, busca);
    }
}
