package com.rebecmatchapi.rebecmatch_api.controller;

import com.rebecmatchapi.rebecmatch_api.dto.DtoMapper;
import com.rebecmatchapi.rebecmatch_api.dto.Formulario.FormularioCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Formulario.FormularioResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Formulario.FormularioUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.service.FormularioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/formularios")
@RequiredArgsConstructor
public class FormularioController {

    private final FormularioService formularioService;

    @PostMapping
    public ResponseEntity<FormularioResponseDTO> createFormulario(@Valid @RequestBody FormularioCreateDTO dto,
                                                                  @AuthenticationPrincipal Usuario usuario) {
        var novoFormulario = formularioService.createFormulario(dto, usuario);
        return ResponseEntity.status(HttpStatus.CREATED).body(DtoMapper.toFormulario(novoFormulario));
    }

    @GetMapping("/{id}")
    public ResponseEntity<FormularioResponseDTO> getFormularioById(@PathVariable Integer id) {
        return ResponseEntity.ok(DtoMapper.toFormulario(formularioService.getFormularioById(id)));
    }

    @GetMapping
    public ResponseEntity<List<FormularioResponseDTO>> getAllFormularios() {
        return ResponseEntity.ok(formularioService.getAllFormularios().stream().map(DtoMapper::toFormulario).toList());
    }

    @PutMapping("/{id}")
    public ResponseEntity<FormularioResponseDTO> updateFormulario(@PathVariable Integer id, @Valid @RequestBody FormularioUpdateDTO dto,
                                                                  @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(DtoMapper.toFormulario(formularioService.updateFormulario(id, dto, usuario)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFormulario(@PathVariable Integer id, @AuthenticationPrincipal Usuario usuario) {
        formularioService.deleteFormulario(id, usuario);
        return ResponseEntity.noContent().build();
    }
}
