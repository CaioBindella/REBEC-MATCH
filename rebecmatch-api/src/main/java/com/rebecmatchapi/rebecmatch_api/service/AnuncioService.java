package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.dto.Anuncio.AnuncioCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Anuncio.AnuncioUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Anuncio;
import com.rebecmatchapi.rebecmatch_api.entity.Busca;
import com.rebecmatchapi.rebecmatch_api.exception.ResourceNotFoundException;
import com.rebecmatchapi.rebecmatch_api.repository.AnuncioRepository;
import com.rebecmatchapi.rebecmatch_api.repository.BuscaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AnuncioService {

    private final AnuncioRepository anuncioRepository;
    private final BuscaRepository buscaRepository;

    public Anuncio createAnuncio(AnuncioCreateDTO dto) {
        Busca busca = buscaRepository.findById(dto.getBuscaId())
                .orElseThrow(() -> new ResourceNotFoundException("Busca com ID " + dto.getBuscaId() + " não encontrada."));
        Anuncio novoAnuncio = new Anuncio();
        novoAnuncio.setMensagem(dto.getMensagem());
        novoAnuncio.setDataExpiracao(dto.getDataExpiracao());
        novoAnuncio.setBusca(busca);
        return anuncioRepository.save(novoAnuncio);
    }

    public Anuncio getAnuncioById(Integer id) {
        return anuncioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Anúncio com ID " + id + " não encontrado."));
    }

    public List<Anuncio> getAllAnuncios() {
        return anuncioRepository.findAll();
    }

    public Anuncio updateAnuncio(Integer id, AnuncioUpdateDTO dto) {
        Anuncio anuncioExistente = getAnuncioById(id);
        anuncioExistente.setMensagem(dto.getMensagem());
        anuncioExistente.setDataExpiracao(dto.getDataExpiracao());
        return anuncioRepository.save(anuncioExistente);
    }

    public void deleteAnuncio(Integer id) {
        if (!anuncioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Anúncio com ID " + id + " não encontrado para exclusão.");
        }
        anuncioRepository.deleteById(id);
    }
}