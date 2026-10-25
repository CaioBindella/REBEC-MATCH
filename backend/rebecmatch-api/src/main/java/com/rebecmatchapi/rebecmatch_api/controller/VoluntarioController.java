package com.rebecmatchapi.rebecmatch_api.controller;

import com.rebecmatchapi.rebecmatch_api.dto.DtoMapper;
import com.rebecmatchapi.rebecmatch_api.dto.Voluntario.VoluntarioResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Voluntario.VoluntarioUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.service.VoluntarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/**
 * Perfil pseudonimizado do voluntário. O perfil é criado junto com a conta e só é visível ao titular
 * e aos pesquisadores dos estudos aos quais ele se candidatou.
 */
@RestController
@RequestMapping("/api/v1/voluntarios")
@RequiredArgsConstructor
public class VoluntarioController {

    private final VoluntarioService voluntarioService;

    @GetMapping("/{id}")
    public ResponseEntity<VoluntarioResponseDTO> getById(@PathVariable Integer id, @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(DtoMapper.toVoluntario(voluntarioService.getById(id, usuario)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VoluntarioResponseDTO> updateVoluntario(@PathVariable Integer id, @Valid @RequestBody VoluntarioUpdateDTO dto,
                                                                  @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(DtoMapper.toVoluntario(voluntarioService.updateVoluntario(id, dto, usuario)));
    }
}
