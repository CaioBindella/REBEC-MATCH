package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.dto.Estudo.EstudoCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Estudo.EstudoUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Estudo;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.entity.enums.StatusRecrutamento;
import com.rebecmatchapi.rebecmatch_api.exception.BadRequestException;
import com.rebecmatchapi.rebecmatch_api.exception.ResourceNotFoundException;
import com.rebecmatchapi.rebecmatch_api.repository.EstudoRepository;
import com.rebecmatchapi.rebecmatch_api.repository.PesquisadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EstudoService {

    /** Tamanho mínimo do termo de busca por doença (o aplicativo só dispara a consulta a partir dele). */
    public static final int TAMANHO_MINIMO_BUSCA = 3;

    private final EstudoRepository estudoRepository;
    private final PesquisadorRepository pesquisadorRepository;
    private final AcessoService acessoService;

    // O pesquisador responsável é sempre o usuário autenticado
    @Transactional
    public Estudo createEstudo(EstudoCreateDTO dto, Usuario usuario) {
        Estudo novoEstudo = new Estudo();
        novoEstudo.setPesquisador(acessoService.pesquisadorDo(usuario));
        novoEstudo.setPublicTitle(dto.getPublicTitle().trim());
        novoEstudo.setScientificTitle(dto.getScientificTitle().trim());
        novoEstudo.setRecruitmentStatus(StatusRecrutamento.deTexto(dto.getRecruitmentStatus()).getRotulo());
        novoEstudo.setStudyType(textoOuVazio(dto.getStudyType()));
        novoEstudo.setPhase(textoOuVazio(dto.getPhase()));
        novoEstudo.setDateRegistration(dto.getDateRegistration());
        novoEstudo.setDateEnrolment(dto.getDateEnrolment());
        novoEstudo.setUrl(textoOuVazio(dto.getUrl()));
        novoEstudo.setPrimarySponsor(textoOuVazio(dto.getPrimarySponsor()));
        novoEstudo.setHcFreetext(textoOuVazio(dto.getHcFreetext()));
        novoEstudo.setIFreetext(textoOuVazio(dto.getIFreetext()));
        novoEstudo.setApprovalDate(dto.getApprovalDate());
        novoEstudo.setSecId(dto.getSecId());
        novoEstudo.setTrialId(dto.getTrialId().trim());
        return estudoRepository.save(novoEstudo);
    }

    @Transactional(readOnly = true)
    public Estudo getEstudoById(Integer id) {
        return estudoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Estudo com ID " + id + " não encontrado."));
    }

    /** Estudos em recrutamento associados a uma doença (nome popular ou científico) ou ao texto livre de condição. */
    @Transactional(readOnly = true)
    public List<Estudo> buscarEstudosPorDoenca(String termo) {
        if (termo == null || termo.trim().length() < TAMANHO_MINIMO_BUSCA) {
            throw new BadRequestException("Informe ao menos " + TAMANHO_MINIMO_BUSCA + " caracteres para a busca.");
        }
        return estudoRepository.findByDoencaNome(termo.trim()).stream()
                .filter(e -> StatusRecrutamento.RECRUTANDO.getRotulo().equalsIgnoreCase(e.getRecruitmentStatus()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<Estudo> getEstudosByPesquisadorId(Integer pesquisadorId) {
        if (!pesquisadorRepository.existsById(pesquisadorId)) {
            throw new ResourceNotFoundException("Pesquisador com ID " + pesquisadorId + " não encontrado.");
        }
        return estudoRepository.findByPesquisadorId(pesquisadorId);
    }

    @Transactional(readOnly = true)
    public List<Estudo> getEstudosRecrutando() {
        return estudoRepository.findByRecruitmentStatusIgnoreCase(StatusRecrutamento.RECRUTANDO.getRotulo());
    }

    @Transactional(readOnly = true)
    public List<Estudo> getAllEstudos() {
        return estudoRepository.findAll();
    }

    @Transactional
    public Estudo updateEstudo(Integer id, EstudoUpdateDTO dto, Usuario usuario) {
        Estudo estudoExistente = getEstudoById(id);
        acessoService.exigirDonoDoEstudo(usuario, estudoExistente);

        estudoExistente.setPublicTitle(dto.getPublicTitle().trim());
        estudoExistente.setScientificTitle(dto.getScientificTitle().trim());
        estudoExistente.setRecruitmentStatus(StatusRecrutamento.deTexto(dto.getRecruitmentStatus()).getRotulo());
        estudoExistente.setStudyType(textoOuVazio(dto.getStudyType()));
        estudoExistente.setPhase(textoOuVazio(dto.getPhase()));
        estudoExistente.setDateRegistration(dto.getDateRegistration());
        estudoExistente.setDateEnrolment(dto.getDateEnrolment());
        estudoExistente.setUrl(textoOuVazio(dto.getUrl()));
        estudoExistente.setPrimarySponsor(textoOuVazio(dto.getPrimarySponsor()));
        estudoExistente.setHcFreetext(textoOuVazio(dto.getHcFreetext()));
        estudoExistente.setIFreetext(textoOuVazio(dto.getIFreetext()));
        estudoExistente.setApprovalDate(dto.getApprovalDate());
        estudoExistente.setSecId(dto.getSecId());
        estudoExistente.setTrialId(dto.getTrialId().trim());
        return estudoRepository.save(estudoExistente);
    }

    @Transactional
    public void deleteEstudo(Integer id, Usuario usuario) {
        Estudo estudo = getEstudoById(id);
        acessoService.exigirDonoDoEstudo(usuario, estudo);
        estudoRepository.delete(estudo);
    }

    private static String textoOuVazio(String texto) {
        return texto == null ? "" : texto.trim();
    }
}
