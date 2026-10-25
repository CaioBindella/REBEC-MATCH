package com.rebecmatchapi.rebecmatch_api.controller;

import com.rebecmatchapi.rebecmatch_api.dto.DtoMapper;
import com.rebecmatchapi.rebecmatch_api.dto.Usuario.ChangePasswordDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Usuario.UsuarioCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Usuario.UsuarioResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Usuario.UsuarioUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.exception.ForbiddenException;
import com.rebecmatchapi.rebecmatch_api.service.UsuarioService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/usuarios")
@RequiredArgsConstructor
public class UsuarioController {

    private final UsuarioService usuarioService;

    // Cadastro público de conta; o perfil (voluntário ou pesquisador) é criado automaticamente
    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> createUser(@Valid @RequestBody UsuarioCreateDTO usuarioDTO) {
        Usuario newUser = usuarioService.createUser(usuarioDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(DtoMapper.toUsuario(newUser));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> getUserById(@PathVariable Integer id,
                                                          @AuthenticationPrincipal Usuario usuarioLogado) {
        exigirDono(id, usuarioLogado);
        return ResponseEntity.ok(DtoMapper.toUsuario(usuarioService.getUserById(id)));
    }

    @PutMapping("/{id}/senha")
    public ResponseEntity<Void> alterarSenha(@PathVariable Integer id, @Valid @RequestBody ChangePasswordDTO dto,
                                             @AuthenticationPrincipal Usuario usuarioLogado) {
        exigirDono(id, usuarioLogado);
        usuarioService.alterarSenha(id, dto.getSenhaAtual(), dto.getNovaSenha());
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> updateUser(@PathVariable Integer id, @Valid @RequestBody UsuarioUpdateDTO usuarioDTO,
                                                         @AuthenticationPrincipal Usuario usuarioLogado) {
        exigirDono(id, usuarioLogado);
        return ResponseEntity.ok(DtoMapper.toUsuario(usuarioService.updateUser(id, usuarioDTO)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id, @AuthenticationPrincipal Usuario usuarioLogado) {
        exigirDono(id, usuarioLogado);
        usuarioService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    private void exigirDono(Integer id, Usuario usuarioLogado) {
        if (!usuarioLogado.getId().equals(id)) {
            throw new ForbiddenException("Você só pode gerenciar os dados da sua própria conta.");
        }
    }
}
