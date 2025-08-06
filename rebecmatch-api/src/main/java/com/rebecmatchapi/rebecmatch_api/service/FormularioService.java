package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.dto.Formulario.FormularioCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Formulario.FormularioUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Estudo;
import com.rebecmatchapi.rebecmatch_api.entity.Formulario;
import com.rebecmatchapi.rebecmatch_api.exception.ResourceNotFoundException;
import com.rebecmatchapi.rebecmatch_api.repository.EstudoRepository;
import com.rebecmatchapi.rebecmatch_api.repository.FormularioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.OffsetDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FormularioService {

    private final FormularioRepository formularioRepository;
    private final EstudoRepository estudoRepository;

    public Formulario createFormulario(FormularioCreateDTO dto) {
        Estudo estudo = estudoRepository.findById(dto.getEstudoId())
                .orElseThrow(() -> new ResourceNotFoundException("Estudo com ID " + dto.getEstudoId() + " não encontrado."));

        Formulario novoFormulario = new Formulario();
        novoFormulario.setTitulo(dto.getTitulo());
        novoFormulario.setTextoParaRespostaLivre(dto.getTextoParaRespostaLivre());
        novoFormulario.setEstudo(estudo);
        novoFormulario.setDataCriacao(OffsetDateTime.now());

        return formularioRepository.save(novoFormulario);
    }

    public Formulario getFormularioById(Integer id) {
        return formularioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Formulário com ID " + id + " não encontrado."));
    }

    public List<Formulario> getAllFormularios() {
        return formularioRepository.findAll();
    }

    public Formulario updateFormulario(Integer id, FormularioUpdateDTO dto) {
        Formulario formularioExistente = getFormularioById(id);
        formularioExistente.setTitulo(dto.getTitulo());
        formularioExistente.setTextoParaRespostaLivre(dto.getTextoParaRespostaLivre());
        return formularioRepository.save(formularioExistente);
    }

    public void deleteFormulario(Integer id) {
        if (!formularioRepository.existsById(id)) {
            throw new ResourceNotFoundException("Formulário com ID " + id + " não encontrado para exclusão.");
        }
        formularioRepository.deleteById(id);
    }
}