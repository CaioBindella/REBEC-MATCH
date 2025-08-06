package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.dto.Busca.BuscaCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Busca.BuscaUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Busca;
import com.rebecmatchapi.rebecmatch_api.entity.Pesquisador;
import com.rebecmatchapi.rebecmatch_api.exception.ResourceNotFoundException;
import com.rebecmatchapi.rebecmatch_api.repository.BuscaRepository;
import com.rebecmatchapi.rebecmatch_api.repository.PesquisadorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BuscaService {

    private final BuscaRepository buscaRepository;
    private final PesquisadorRepository pesquisadorRepository;

    public Busca createBusca(BuscaCreateDTO dto) {
        Pesquisador pesquisador = pesquisadorRepository.findById(dto.getPesquisadorId())
                .orElseThrow(() -> new ResourceNotFoundException("Pesquisador com ID " + dto.getPesquisadorId() + " não encontrado."));

        Busca novaBusca = new Busca();
        novaBusca.setNome(dto.getNome());
        novaBusca.setPesquisador(pesquisador);

        return buscaRepository.save(novaBusca);
    }

    public Busca getBuscaById(Integer id) {
        return buscaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Busca com ID " + id + " não encontrada."));
    }

    public List<Busca> getAllBuscas() {
        return buscaRepository.findAll();
    }

    public Busca updateBusca(Integer id, BuscaUpdateDTO dto) {
        Busca buscaExistente = getBuscaById(id);
        buscaExistente.setNome(dto.getNome());
        return buscaRepository.save(buscaExistente);
    }

    public void deleteBusca(Integer id) {
        if (!buscaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Busca com ID " + id + " não encontrada para exclusão.");
        }
        buscaRepository.deleteById(id);
    }
}
