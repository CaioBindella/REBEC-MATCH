package com.rebecmatchapi.rebecmatch_api.controller;

import com.rebecmatchapi.rebecmatch_api.dto.Usuario.UsuarioCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Usuario.UsuarioResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Usuario.UsuarioUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

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
    public ResponseEntity<UsuarioResponseDTO> getUserById(@PathVariable Integer id) {
        Usuario usuario = usuarioService.getUserById(id);
        return ResponseEntity.ok(toResponseDTO(usuario));
    }

    // Retorna uma Lista de UsuarioResponseDTO
    @GetMapping
    public ResponseEntity<List<UsuarioResponseDTO>> listUsers() {
        List<Usuario> usuarios = usuarioService.getAllUsers();
        List<UsuarioResponseDTO> dtos = usuarios.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    // Recebe UsuarioUpdateDTO e retorna UsuarioResponseDTO
    @PutMapping("/{id}")
    public ResponseEntity<UsuarioResponseDTO> updateUser(@PathVariable Integer id, @RequestBody UsuarioUpdateDTO usuarioDTO) {
        Usuario usuarioAtualizado = usuarioService.updateUser(id, usuarioDTO);
        return ResponseEntity.ok(toResponseDTO(usuarioAtualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Integer id) {
        usuarioService.deleteUser(id);
        return ResponseEntity.noContent().build();
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
        dto.setDataNascimento(usuario.getDataNascimento());
        dto.setTelefone(usuario.getTelefone());
        dto.setEndereco(usuario.getEndereco());
        dto.setDocumento(usuario.getDocumento());
        dto.setTester(usuario.isTester());
        return dto;
    }
}
