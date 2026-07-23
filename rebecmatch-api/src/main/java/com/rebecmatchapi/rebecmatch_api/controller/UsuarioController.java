package com.rebecmatchapi.rebecmatch_api.controller;

import com.rebecmatchapi.rebecmatch_api.dto.Usuario.ChangePasswordDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Usuario.UsuarioCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Usuario.UsuarioResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Usuario.UsuarioUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.exception.ForbiddenException;
import com.rebecmatchapi.rebecmatch_api.service.UsuarioService;
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

    // Retorna UsuarioResponseDTO
    @PostMapping
    public ResponseEntity<UsuarioResponseDTO> createUser(@RequestBody UsuarioCreateDTO usuarioDTO) {
        Usuario newUser = usuarioService.createUser(usuarioDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(newUser));
    }

    // Retorna UsuarioResponseDTO
    @GetMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> getUserById(@PathVariable Integer id,
                                                            @AuthenticationPrincipal Usuario usuarioLogado) {
        exigirDono(id, usuarioLogado);
        Usuario usuario = usuarioService.getUserById(id);
        return ResponseEntity.ok(toResponseDTO(usuario));
    }

    @PutMapping("/{id}/senha")
    public ResponseEntity<Void> alterarSenha(@PathVariable Integer id, @RequestBody ChangePasswordDTO dto,
                                              @AuthenticationPrincipal Usuario usuarioLogado) {
        exigirDono(id, usuarioLogado);
        usuarioService.alterarSenha(id, dto.getSenhaAtual(), dto.getNovaSenha());
        return ResponseEntity.noContent().build();
    }

    // Recebe UsuarioUpdateDTO e retorna UsuarioResponseDTO
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> updateUser(@PathVariable Integer id, @RequestBody UsuarioUpdateDTO usuarioDTO,
                                                           @AuthenticationPrincipal Usuario usuarioLogado) {
        exigirDono(id, usuarioLogado);
        Usuario usuarioAtualizado = usuarioService.updateUser(id, usuarioDTO);
        return ResponseEntity.ok(toResponseDTO(usuarioAtualizado));
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

    // Método auxiliar para converter Entidade -> DTO de Resposta
    private UsuarioResponseDTO toResponseDTO(Usuario usuario) {
        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setId(usuario.getId());
        dto.setNome(usuario.getNome());
        dto.setSobrenome(usuario.getSobrenome());
        dto.setLogin(usuario.getLogin());
        dto.setEmail(usuario.getEmail());
        dto.setTipo(usuario.getTipo());
        dto.setTipoEspecifico(usuario.getTipoEspecifico());
        dto.setSexo(usuario.getSexo());
        dto.setTester(usuario.isTester());
        return dto;
    }
}
