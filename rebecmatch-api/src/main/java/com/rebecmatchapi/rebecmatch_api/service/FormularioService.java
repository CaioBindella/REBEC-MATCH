package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.dto.Formulario.FormularioCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Formulario.FormularioUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Estudo;
import com.rebecmatchapi.rebecmatch_api.entity.Formulario;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.exception.ForbiddenException;
import com.rebecmatchapi.rebecmatch_api.exception.ResourceNotFoundException;
import com.rebecmatchapi.rebecmatch_api.repository.EstudoRepository;
import com.rebecmatchapi.rebecmatch_api.repository.FormularioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FormularioService {

    private final FormularioRepository formularioRepository;
    private final EstudoRepository estudoRepository;
    private final AcessoService acessoService;

    @Transactional
    public Formulario createFormulario(FormularioCreateDTO dto, Usuario usuario) {
        Estudo estudo = estudoRepository.findById(dto.getEstudoId())
                .orElseThrow(() -> new ResourceNotFoundException("Estudo com ID " + dto.getEstudoId() + " não encontrado."));
        acessoService.exigirDonoDoEstudo(usuario, estudo);

        Formulario novoFormulario = new Formulario();
        novoFormulario.setTitulo(dto.getTitulo());
        novoFormulario.setTextoParaRespostaLivre(dto.getTextoParaRespostaLivre());
        novoFormulario.setEstudo(estudo);
        novoFormulario.setDataCriacao(LocalDate.now());
        return formularioRepository.save(novoFormulario);
    }

    @Transactional(readOnly = true)
    public Formulario getFormularioById(Integer id) {
        return formularioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Formulário com ID " + id + " não encontrado."));
    }

    @Transactional(readOnly = true)
    public List<Formulario> getAllFormularios() {
        return formularioRepository.findAll();
    }

    @Transactional
    public Formulario updateFormulario(Integer id, FormularioUpdateDTO dto, Usuario usuario) {
        Formulario formularioExistente = getFormularioById(id);
        exigirEdicaoPermitida(formularioExistente, usuario);
        formularioExistente.setTitulo(dto.getTitulo());
        formularioExistente.setTextoParaRespostaLivre(dto.getTextoParaRespostaLivre());
        return formularioRepository.save(formularioExistente);
    }

    @Transactional
    public void deleteFormulario(Integer id, Usuario usuario) {
        Formulario formulario = getFormularioById(id);
        exigirEdicaoPermitida(formulario, usuario);
        formularioRepository.delete(formulario);
    }

    /**
     * Formulários globais (sem estudo, como o formulário de perfil inicial) são definidos pelas
     * migrações do banco; formulários de estudo só podem ser alterados pelo pesquisador responsável.
     */
    void exigirEdicaoPermitida(Formulario formulario, Usuario usuario) {
        if (formulario.getEstudo() == null) {
            throw new ForbiddenException("O formulário global de perfil não pode ser alterado pela API.");
        }
        acessoService.exigirDonoDoEstudo(usuario, formulario.getEstudo());
    }
}
