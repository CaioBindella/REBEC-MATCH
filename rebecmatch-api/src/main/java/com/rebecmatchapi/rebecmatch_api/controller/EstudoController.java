package com.rebecmatchapi.rebecmatch_api.controller;

import com.rebecmatchapi.rebecmatch_api.dto.Estudo.EstudoCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Estudo.EstudoResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Estudo.EstudoUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Pesquisador.PesquisadorResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Usuario.UsuarioResponseDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Estudo;
import com.rebecmatchapi.rebecmatch_api.entity.Pesquisador;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.service.EstudoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/estudos")
@RequiredArgsConstructor
public class EstudoController {

    private final EstudoService estudoService;

    @PostMapping
    public ResponseEntity<EstudoResponseDTO> createEstudo(@RequestBody EstudoCreateDTO dto) {
        Estudo novoEstudo = estudoService.createEstudo(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(novoEstudo));
    }

    @GetMapping("/{id}")
    public ResponseEntity<EstudoResponseDTO> getEstudoById(@PathVariable Integer id) {
        Estudo estudo = estudoService.getEstudoById(id);
        return ResponseEntity.ok(toResponseDTO(estudo));
    }

    @GetMapping
    public ResponseEntity<List<EstudoResponseDTO>> getAllEstudos() {
        List<Estudo> estudos = estudoService.getAllEstudos();
        List<EstudoResponseDTO> dtos = estudos.stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<EstudoResponseDTO> updateEstudo(@PathVariable Integer id, @RequestBody EstudoUpdateDTO dto) {
        Estudo estudoAtualizado = estudoService.updateEstudo(id, dto);
        return ResponseEntity.ok(toResponseDTO(estudoAtualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEstudo(@PathVariable Integer id) {
        estudoService.deleteEstudo(id);
        return ResponseEntity.noContent().build();
    }

    // --- MÉTODOS DE MAPEAMENTO ---

    private EstudoResponseDTO toResponseDTO(Estudo estudo) {
        EstudoResponseDTO dto = new EstudoResponseDTO();
        dto.setId(estudo.getId());
        dto.setTitulo(estudo.getTitulo());
        dto.setCodigoRegistro(estudo.getCodigoRegistro());
        dto.setStatus(estudo.getStatus());
        dto.setDataInicio(estudo.getDataInicio());
        dto.setDataFim(estudo.getDataFim());
        dto.setInformacoesGerais(estudo.getInformacoesGerais());
        dto.setPesquisador(toPesquisadorResponseDTO(estudo.getPesquisador()));
        return dto;
    }

    private PesquisadorResponseDTO toPesquisadorResponseDTO(Pesquisador pesquisador) {
        if (pesquisador == null) return null;
        PesquisadorResponseDTO dto = new PesquisadorResponseDTO();
        dto.setId(pesquisador.getId());
        dto.setNomeFicticio(pesquisador.getNomeFicticio());
        dto.setUsuario(toUsuarioResponseDTO(pesquisador.getUsuario()));
        return dto;
    }

    private UsuarioResponseDTO toUsuarioResponseDTO(Usuario usuario) {
        if (usuario == null) return null;
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