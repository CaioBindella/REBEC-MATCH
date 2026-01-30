package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.dto.Resposta.RespostaCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Resposta.RespostaUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Resposta.RespostasBatchCreateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Questao;
import com.rebecmatchapi.rebecmatch_api.entity.Resposta;
import com.rebecmatchapi.rebecmatch_api.entity.Voluntario;
import com.rebecmatchapi.rebecmatch_api.exception.ResourceNotFoundException;
import com.rebecmatchapi.rebecmatch_api.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class RespostaService {

    private final RespostaRepository respostaRepository;
    private final VoluntarioRepository voluntarioRepository;
    private final QuestaoRepository questaoRepository;
    private final FormularioRepository formularioRepository;

    public Resposta createResposta(RespostaCreateDTO dto) {
        Voluntario voluntario = voluntarioRepository.findById(dto.getVoluntarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Voluntário com ID " + dto.getVoluntarioId() + " não encontrado."));
        Questao questao = questaoRepository.findById(dto.getQuestaoId())
                .orElseThrow(() -> new ResourceNotFoundException("Questão com ID " + dto.getQuestaoId() + " não encontrada."));

        Resposta novaResposta = new Resposta();
        novaResposta.setConteudo(dto.getConteudo());
        novaResposta.setMarcado(dto.isMarcado());
        novaResposta.setVoluntario(voluntario);
        novaResposta.setQuestao(questao);

        return respostaRepository.save(novaResposta);
    }

    public Resposta getRespostaById(Integer id) {
        return respostaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resposta com ID " + id + " não encontrada."));
    }

    public List<Resposta> listarPorUsuario(Integer usuarioId) {
        Voluntario voluntario = voluntarioRepository.findByUsuarioId(usuarioId)
                .orElse(null);
        if (voluntario == null) {
            return new ArrayList<>();
        }
        return respostaRepository.findByVoluntarioId(voluntario.getId());
    }

    public List<Resposta> getRespostasByVoluntarioId(Integer voluntarioId) {
        return respostaRepository.findByVoluntarioId(voluntarioId);
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

    @Transactional
    public void createRespostasEmLote(RespostasBatchCreateDTO dto) {
        Voluntario voluntario = voluntarioRepository.findByUsuarioId(dto.getVoluntarioId())
                .orElseThrow(() -> new ResourceNotFoundException("Voluntário vinculado ao usuário " + dto.getVoluntarioId() + " não encontrado."));

        formularioRepository.findById(dto.getFormularioId())
                .orElseThrow(() -> new ResourceNotFoundException("Formulário com ID " + dto.getFormularioId() + " não encontrado."));

        List<Resposta> novasRespostas = new ArrayList<>();
        for (RespostasBatchCreateDTO.RespostaIndividualDTO respostaDto : dto.getRespostas()) {

            if (respostaDto.getQuestaoId() == null) {
                throw new ResourceNotFoundException("ID da questão não pode ser nulo.");
            }

            Questao questao = questaoRepository.findById(respostaDto.getQuestaoId())
                    .orElseThrow(() -> new ResourceNotFoundException("Questão com ID " + respostaDto.getQuestaoId() + " não encontrada."));

            Resposta novaResposta = new Resposta();
            novaResposta.setConteudo(respostaDto.getConteudo());
            novaResposta.setMarcado(respostaDto.isMarcado());
            novaResposta.setVoluntario(voluntario);
            novaResposta.setQuestao(questao);
            novasRespostas.add(novaResposta);
        }
        respostaRepository.saveAll(novasRespostas);
    }
}
