package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.dto.Resposta.RespostaCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Resposta.RespostaUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.*;
import com.rebecmatchapi.rebecmatch_api.exception.ResourceNotFoundException;
import com.rebecmatchapi.rebecmatch_api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RespostaService {

    private final RespostaRepository respostaRepository;
    private final VoluntarioRepository voluntarioRepository;
    private final BuscaRepository buscaRepository;
    private final QuestaoRepository questaoRepository;

    public Resposta createResposta(RespostaCreateDTO dto) {
        Voluntario voluntario = voluntarioRepository.findById(dto.getVoluntarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Voluntário com ID " + dto.getVoluntarioId() + " não encontrado."));
        Busca busca = buscaRepository.findById(dto.getBuscaId())
                .orElseThrow(() -> new ResourceNotFoundException("Busca com ID " + dto.getBuscaId() + " não encontrada."));
        Questao questao = questaoRepository.findById(dto.getQuestaoId())
                .orElseThrow(() -> new ResourceNotFoundException("Questão com ID " + dto.getQuestaoId() + " não encontrada."));

        Resposta novaResposta = new Resposta();
        novaResposta.setConteudo(dto.getConteudo());
        novaResposta.setMarcado(dto.isMarcado());
        novaResposta.setVoluntario(voluntario);
        novaResposta.setBusca(busca);
        novaResposta.setQuestao(questao);

        return respostaRepository.save(novaResposta);
    }

    public Resposta getRespostaById(Integer id) {
        return respostaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resposta com ID " + id + " não encontrada."));
    }

    public List<Resposta> getAllRespostas() {
        return respostaRepository.findAll();
    }

    public Resposta updateResposta(Integer id, RespostaUpdateDTO dto) {
        Resposta respostaExistente = getRespostaById(id);
        respostaExistente.setConteudo(dto.getConteudo());
        respostaExistente.setMarcado(dto.isMarcado());
        return respostaRepository.save(respostaExistente);
    }

    public void deleteResposta(Integer id) {
        if (!respostaRepository.existsById(id)) {
            throw new ResourceNotFoundException("Resposta com ID " + id + " não encontrada para exclusão.");
        }
        respostaRepository.deleteById(id);
    }
}
