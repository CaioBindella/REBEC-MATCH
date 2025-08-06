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
        novoEstudo.setTitulo(dto.getTitulo());
        novoEstudo.setCodigoRegistro(dto.getCodigoRegistro());
        novoEstudo.setStatus(dto.getStatus());
        novoEstudo.setDataInicio(dto.getDataInicio());
        novoEstudo.setDataFim(dto.getDataFim());
        novoEstudo.setInformacoesGerais(dto.getInformacoesGerais());
        novoEstudo.setPesquisador(pesquisador);

        return estudoRepository.save(novoEstudo);
    }

    public Estudo getEstudoById(Integer id) {
        return estudoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Estudo com ID " + id + " não encontrado."));
    }

    public List<Estudo> getAllEstudos() {
        return estudoRepository.findAll();
    }

    public Estudo updateEstudo(Integer id, EstudoUpdateDTO dto) {
        Estudo estudoExistente = getEstudoById(id);
        estudoExistente.setTitulo(dto.getTitulo());
        estudoExistente.setCodigoRegistro(dto.getCodigoRegistro());
        estudoExistente.setStatus(dto.getStatus());
        estudoExistente.setDataInicio(dto.getDataInicio());
        estudoExistente.setDataFim(dto.getDataFim());
        estudoExistente.setInformacoesGerais(dto.getInformacoesGerais());
        return estudoRepository.save(estudoExistente);
    }

    public void deleteEstudo(Integer id) {
        if (!estudoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Estudo com ID " + id + " não encontrado para exclusão.");
        }
        estudoRepository.deleteById(id);
    }
}
