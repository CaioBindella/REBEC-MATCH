package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.dto.Resposta.RespostaCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Resposta.RespostaUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Resposta.RespostasBatchCreateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Questao;
import com.rebecmatchapi.rebecmatch_api.entity.Resposta;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.entity.Voluntario;
import com.rebecmatchapi.rebecmatch_api.exception.BadRequestException;
import com.rebecmatchapi.rebecmatch_api.exception.ForbiddenException;
import com.rebecmatchapi.rebecmatch_api.exception.ResourceNotFoundException;
import com.rebecmatchapi.rebecmatch_api.repository.FormularioRepository;
import com.rebecmatchapi.rebecmatch_api.repository.QuestaoRepository;
import com.rebecmatchapi.rebecmatch_api.repository.RespostaRepository;
import com.rebecmatchapi.rebecmatch_api.repository.VoluntarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

/**
 * Respostas dos formulários (dados de perfil e de saúde do voluntário). Cada voluntário grava apenas
 * as próprias respostas; a leitura é permitida ao titular e aos pesquisadores dos estudos aos quais
 * ele se candidatou (ver AcessoService).
 */
@Service
@RequiredArgsConstructor
public class RespostaService {

    private final RespostaRepository respostaRepository;
    private final VoluntarioRepository voluntarioRepository;
    private final QuestaoRepository questaoRepository;
    private final FormularioRepository formularioRepository;
    private final AcessoService acessoService;

    @Transactional
    public Resposta createResposta(RespostaCreateDTO dto, Usuario usuario) {
        Voluntario voluntario = acessoService.voluntarioDo(usuario);
        Questao questao = questaoRepository.findById(dto.getQuestaoId())
                .orElseThrow(() -> new ResourceNotFoundException("Questão com ID " + dto.getQuestaoId() + " não encontrada."));

        Resposta novaResposta = new Resposta();
        novaResposta.setConteudo(textoOuVazio(dto.getConteudo()));
        novaResposta.setMarcado(dto.isMarcado());
        novaResposta.setVoluntario(voluntario);
        novaResposta.setQuestao(questao);
        return respostaRepository.save(novaResposta);
    }

    /**
     * Grava todas as respostas de um formulário em uma única operação. Um novo envio substitui as
     * respostas anteriores do mesmo voluntário para esse formulário, evitando registros duplicados.
     */
    @Transactional
    public List<Resposta> createRespostasEmLote(RespostasBatchCreateDTO dto, Usuario usuario) {
        Voluntario voluntario = acessoService.voluntarioDo(usuario);

        formularioRepository.findById(dto.getFormularioId())
                .orElseThrow(() -> new ResourceNotFoundException("Formulário com ID " + dto.getFormularioId() + " não encontrado."));

        Map<Integer, Questao> questoesDoFormulario = questaoRepository.findByFormularioId(dto.getFormularioId()).stream()
                .collect(Collectors.toMap(Questao::getId, Function.identity()));

        List<Resposta> novasRespostas = new ArrayList<>();
        for (RespostasBatchCreateDTO.RespostaIndividualDTO respostaDto : dto.getRespostas()) {
            Questao questao = questoesDoFormulario.get(respostaDto.getQuestaoId());
            if (questao == null) {
                throw new BadRequestException("A questão " + respostaDto.getQuestaoId() + " não pertence ao formulário " + dto.getFormularioId() + ".");
            }
            Resposta novaResposta = new Resposta();
            novaResposta.setConteudo(textoOuVazio(respostaDto.getConteudo()));
            novaResposta.setMarcado(respostaDto.isMarcado());
            novaResposta.setVoluntario(voluntario);
            novaResposta.setQuestao(questao);
            novasRespostas.add(novaResposta);
        }

        Set<Integer> respondidas = novasRespostas.stream()
                .filter(r -> !r.getConteudo().isBlank())
                .map(r -> r.getQuestao().getId())
                .collect(Collectors.toSet());
        List<String> obrigatoriasSemResposta = questoesDoFormulario.values().stream()
                .filter(Questao::isObrigatorio)
                .filter(q -> !respondidas.contains(q.getId()))
                .map(Questao::getTexto)
                .toList();
        if (!obrigatoriasSemResposta.isEmpty()) {
            throw new BadRequestException("Responda às questões obrigatórias: " + String.join("; ", obrigatoriasSemResposta));
        }

        respostaRepository.deleteAll(respostaRepository.findByVoluntarioIdAndQuestaoFormularioId(voluntario.getId(), dto.getFormularioId()));
        respostaRepository.flush();
        return respostaRepository.saveAll(novasRespostas);
    }

    @Transactional(readOnly = true)
    public Resposta getRespostaById(Integer id, Usuario usuario) {
        Resposta resposta = buscar(id);
        acessoService.exigirAcessoAoVoluntario(usuario, resposta.getVoluntario());
        return resposta;
    }

    @Transactional(readOnly = true)
    public List<Resposta> getRespostasByVoluntarioId(Integer voluntarioId, Usuario usuario) {
        Voluntario voluntario = voluntarioRepository.findById(voluntarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Voluntário com ID " + voluntarioId + " não encontrado."));
        acessoService.exigirAcessoAoVoluntario(usuario, voluntario);
        return respostaRepository.findByVoluntarioId(voluntarioId);
    }

    /** Respostas a partir do id de usuário do voluntário (lista vazia se o usuário não for voluntário). */
    @Transactional(readOnly = true)
    public List<Resposta> listarPorUsuario(Integer usuarioId, Usuario usuario) {
        Voluntario voluntario = voluntarioRepository.findByUsuarioId(usuarioId).orElse(null);
        if (voluntario == null) {
            acessoService.exigirTitular(usuario, usuarioId);
            return List.of();
        }
        acessoService.exigirAcessoAoVoluntario(usuario, voluntario);
        return respostaRepository.findByVoluntarioId(voluntario.getId());
    }

    @Transactional
    public Resposta updateResposta(Integer id, RespostaUpdateDTO dto, Usuario usuario) {
        Resposta respostaExistente = buscar(id);
        exigirAutor(respostaExistente, usuario);
        respostaExistente.setConteudo(textoOuVazio(dto.getConteudo()));
        respostaExistente.setMarcado(dto.isMarcado());
        return respostaRepository.save(respostaExistente);
    }

    @Transactional
    public void deleteResposta(Integer id, Usuario usuario) {
        Resposta resposta = buscar(id);
        exigirAutor(resposta, usuario);
        respostaRepository.delete(resposta);
    }

    private void exigirAutor(Resposta resposta, Usuario usuario) {
        Voluntario voluntario = acessoService.voluntarioDo(usuario);
        if (!resposta.getVoluntario().getId().equals(voluntario.getId())) {
            throw new ForbiddenException("Você só pode alterar as suas próprias respostas.");
        }
    }

    private Resposta buscar(Integer id) {
        return respostaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Resposta com ID " + id + " não encontrada."));
    }

    private static String textoOuVazio(String texto) {
        return texto == null ? "" : texto.trim();
    }
}
