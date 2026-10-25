package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.dto.Criterio.CriterioCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Criterio.CriterioUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Criterio;
import com.rebecmatchapi.rebecmatch_api.entity.Estudo;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.entity.enums.GeneroElegivel;
import com.rebecmatchapi.rebecmatch_api.exception.BadRequestException;
import com.rebecmatchapi.rebecmatch_api.exception.ResourceNotFoundException;
import com.rebecmatchapi.rebecmatch_api.repository.CriterioRepository;
import com.rebecmatchapi.rebecmatch_api.repository.EstudoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CriterioService {

    private final CriterioRepository criterioRepository;
    private final EstudoRepository estudoRepository;
    private final AcessoService acessoService;
    private final ElegibilidadeService elegibilidadeService;

    @Transactional
    public Criterio createCriterio(CriterioCreateDTO dto, Usuario usuario) {
        Estudo estudo = estudoRepository.findById(dto.getEstudoId())
                .orElseThrow(() -> new ResourceNotFoundException("Estudo com ID " + dto.getEstudoId() + " não encontrado."));
        acessoService.exigirDonoDoEstudo(usuario, estudo);

        Criterio novoCriterio = new Criterio();
        novoCriterio.setEstudo(estudo);
        preencher(novoCriterio, dto.getInclusionCriteria(), dto.getExclusionCriteria(), dto.getAgeMin(), dto.getAgeMax(), dto.getGender());
        return criterioRepository.save(novoCriterio);
    }

    @Transactional(readOnly = true)
    public Criterio getCriterioById(Integer id) {
        return criterioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Critério com ID " + id + " não encontrado."));
    }

    @Transactional(readOnly = true)
    public List<Criterio> getCriteriosDoEstudo(Integer estudoId) {
        return criterioRepository.findByEstudoId(estudoId);
    }

    @Transactional
    public Criterio updateCriterio(Integer id, CriterioUpdateDTO dto, Usuario usuario) {
        Criterio criterioExistente = getCriterioById(id);
        acessoService.exigirDonoDoEstudo(usuario, criterioExistente.getEstudo());
        preencher(criterioExistente, dto.getInclusionCriteria(), dto.getExclusionCriteria(), dto.getAgeMin(), dto.getAgeMax(), dto.getGender());
        return criterioRepository.save(criterioExistente);
    }

    @Transactional
    public void deleteCriterio(Integer id, Usuario usuario) {
        Criterio criterio = getCriterioById(id);
        acessoService.exigirDonoDoEstudo(usuario, criterio.getEstudo());
        criterioRepository.delete(criterio);
    }

    /**
     * Valida os limites etários no formato ICTRP e normaliza o sexo para o domínio da aplicação,
     * garantindo que critérios cadastrados manualmente sejam avaliados da mesma forma que os importados.
     */
    private void preencher(Criterio criterio, String inclusao, String exclusao, String idadeMin, String idadeMax, String genero) {
        if (!elegibilidadeService.idadeValida(idadeMin) || !elegibilidadeService.idadeValida(idadeMax)) {
            throw new BadRequestException("Idade em formato inválido. Use um número seguido da unidade: Y (anos), M (meses), W (semanas), D (dias) ou H (horas). Ex.: 18Y.");
        }
        criterio.setInclusionCriteria(textoOuVazio(inclusao));
        criterio.setExclusionCriteria(textoOuVazio(exclusao));
        criterio.setAgeMin(textoOuVazio(idadeMin).toUpperCase());
        criterio.setAgeMax(textoOuVazio(idadeMax).toUpperCase());
        criterio.setGender(GeneroElegivel.normalizar(genero));
    }

    private static String textoOuVazio(String texto) {
        return texto == null ? "" : texto.trim();
    }
}
