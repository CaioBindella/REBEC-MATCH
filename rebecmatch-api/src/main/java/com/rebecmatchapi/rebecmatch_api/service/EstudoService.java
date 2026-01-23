package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.dto.Estudo.EstudoCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Estudo.EstudoUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Estudo;
import com.rebecmatchapi.rebecmatch_api.entity.Pesquisador;
import com.rebecmatchapi.rebecmatch_api.exception.ResourceNotFoundException;
import com.rebecmatchapi.rebecmatch_api.repository.EstudoRepository;
import com.rebecmatchapi.rebecmatch_api.repository.PesquisadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EstudoService {

    private final EstudoRepository estudoRepository;
    private final PesquisadorRepository pesquisadorRepository;

    public Estudo createEstudo(EstudoCreateDTO dto) {
        Pesquisador pesquisador = pesquisadorRepository.findById(dto.getPesquisadorId())
                .orElseThrow(() -> new ResourceNotFoundException("Pesquisador com ID " + dto.getPesquisadorId() + " não encontrado."));

        Estudo novoEstudo = new Estudo();
        novoEstudo.setPublicTitle(dto.getPublicTitle());
        novoEstudo.setScientificTitle(dto.getScientificTitle());
        novoEstudo.setRecruitmentStatus(dto.getRecruitmentStatus());
        novoEstudo.setStudyType(dto.getStudyType());
        novoEstudo.setPhase(dto.getPhase());
        novoEstudo.setDateRegistration(dto.getDateRegistration());
        novoEstudo.setDateEnrolment(dto.getDateEnrolment());
        novoEstudo.setUrl(dto.getUrl());
        novoEstudo.setPrimarySponsor(dto.getPrimarySponsor());
        novoEstudo.setHcFreetext(dto.getHcFreetext());
        novoEstudo.setIFreetext(dto.getIFreetext());
        novoEstudo.setApprovalDate(dto.getApprovalDate());
        novoEstudo.setSecId(dto.getSecId());
        novoEstudo.setTrialId(dto.getTrialId());
        novoEstudo.setPesquisador(pesquisador);

        return estudoRepository.save(novoEstudo);
    }

    public Estudo getEstudoById(Integer id) {
        return estudoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Estudo com ID " + id + " não encontrado."));
    }

    public List<Estudo> buscarEstudosPorDoenca(String termo) {
        return estudoRepository.findByDoencaNome(termo);
    }

    public List<Estudo> getEstudosByPesquisadorId(Integer pesquisadorId) {
        // Valida se o pesquisador existe antes de buscar (opcional, mas recomendado)
        if (!pesquisadorRepository.existsById(pesquisadorId)) {
            throw new ResourceNotFoundException("Pesquisador com ID " + pesquisadorId + " não encontrado.");
        }
        return estudoRepository.findByPesquisadorId(pesquisadorId);
    }

    public List<Estudo> getAllEstudos() {
        return estudoRepository.findAll();
    }

    public Estudo updateEstudo(Integer id, EstudoUpdateDTO dto) {
        Estudo estudoExistente = getEstudoById(id);
        estudoExistente.setPublicTitle(dto.getPublicTitle());
        estudoExistente.setScientificTitle(dto.getScientificTitle());
        estudoExistente.setRecruitmentStatus(dto.getRecruitmentStatus());
        estudoExistente.setStudyType(dto.getStudyType());
        estudoExistente.setPhase(dto.getPhase());
        estudoExistente.setDateRegistration(dto.getDateRegistration());
        estudoExistente.setDateEnrolment(dto.getDateEnrolment());
        estudoExistente.setUrl(dto.getUrl());
        estudoExistente.setPrimarySponsor(dto.getPrimarySponsor());
        estudoExistente.setHcFreetext(dto.getHcFreetext());
        estudoExistente.setIFreetext(dto.getIFreetext());
        estudoExistente.setApprovalDate(dto.getApprovalDate());
        estudoExistente.setSecId(dto.getSecId());
        estudoExistente.setTrialId(dto.getTrialId());

        return estudoRepository.save(estudoExistente);
    }

    public void deleteEstudo(Integer id) {
        if (!estudoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Estudo com ID " + id + " não encontrado para exclusão.");
        }
        estudoRepository.deleteById(id);
    }
}