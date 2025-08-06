package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.dto.Questao.QuestaoCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Questao.QuestaoUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Formulario;
import com.rebecmatchapi.rebecmatch_api.entity.Questao;
import com.rebecmatchapi.rebecmatch_api.exception.ResourceNotFoundException;
import com.rebecmatchapi.rebecmatch_api.repository.FormularioRepository;
import com.rebecmatchapi.rebecmatch_api.repository.QuestaoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QuestaoService {

    private final QuestaoRepository questaoRepository;
    private final FormularioRepository formularioRepository;

    public Questao createQuestao(QuestaoCreateDTO dto) {
        Formulario formulario = formularioRepository.findById(dto.getFormularioId())
                .orElseThrow(() -> new ResourceNotFoundException("Formulário com ID " + dto.getFormularioId() + " não encontrado."));

        Questao novaQuestao = new Questao();
        novaQuestao.setTexto(dto.getTexto());
        novaQuestao.setTipo(dto.getTipo());
        novaQuestao.setOpcoes(dto.getOpcoes());
        novaQuestao.setObrigatorio(dto.isObrigatorio());
        novaQuestao.setFormulario(formulario);

        return questaoRepository.save(novaQuestao);
    }

    public Questao getQuestaoById(Integer id) {
        return questaoRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Questão com ID " + id + " não encontrada."));
    }

    public List<Questao> getAllQuestoes() {
        return questaoRepository.findAll();
    }

    public Questao updateQuestao(Integer id, QuestaoUpdateDTO dto) {
        Questao questaoExistente = getQuestaoById(id);
        questaoExistente.setTexto(dto.getTexto());
        questaoExistente.setTipo(dto.getTipo());
        questaoExistente.setOpcoes(dto.getOpcoes());
        questaoExistente.setObrigatorio(dto.isObrigatorio());
        return questaoRepository.save(questaoExistente);
    }

    public void deleteQuestao(Integer id) {
        if (!questaoRepository.existsById(id)) {
            throw new ResourceNotFoundException("Questão com ID " + id + " não encontrada para exclusão.");
        }
        questaoRepository.deleteById(id);
    }
}
