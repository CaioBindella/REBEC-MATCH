package com.rebecmatchapi.rebecmatch_api.controller;

import com.rebecmatchapi.rebecmatch_api.dto.Formulario.FormularioCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Formulario.FormularioResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Formulario.FormularioUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Formulario;
import com.rebecmatchapi.rebecmatch_api.service.FormularioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/formularios")
@RequiredArgsConstructor
public class FormularioController {

    private final FormularioService formularioService;

    @PostMapping
    public ResponseEntity<FormularioResponseDTO> createFormulario(@RequestBody FormularioCreateDTO dto) {
        Formulario novoFormulario = formularioService.createFormulario(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(novoFormulario));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FormularioResponseDTO> getFormularioById(@PathVariable Integer id) {
        Formulario formulario = formularioService.getFormularioById(id);
        return ResponseEntity.ok(toResponseDTO(formulario));
    }

    @GetMapping
    public ResponseEntity<List<FormularioResponseDTO>> getAllFormularios() {
        List<Formulario> formularios = formularioService.getAllFormularios();
        List<FormularioResponseDTO> dtos = formularios.stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<FormularioResponseDTO> updateFormulario(@PathVariable Integer id, @RequestBody FormularioUpdateDTO dto) {
        Formulario formularioAtualizado = formularioService.updateFormulario(id, dto);
        return ResponseEntity.ok(toResponseDTO(formularioAtualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFormulario(@PathVariable Integer id) {
        formularioService.deleteFormulario(id);
        return ResponseEntity.noContent().build();
    }

    private FormularioResponseDTO toResponseDTO(Formulario formulario) {
        FormularioResponseDTO dto = new FormularioResponseDTO();
        dto.setId(formulario.getId());
        dto.setTitulo(formulario.getTitulo());
        dto.setTextoParaRespostaLivre(formulario.getTextoParaRespostaLivre());
        dto.setDataCriacao(formulario.getDataCriacao());
        if (formulario.getEstudo() != null) {
            dto.setEstudoId(formulario.getEstudo().getId());
        }
        return dto;
    }
}