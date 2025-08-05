package com.rebecmatchapi.rebecmatch_api.controller;

import com.rebecmatchapi.rebecmatch_api.dto.Pesquisador.PesquisadorCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Pesquisador.PesquisadorResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Pesquisador.PesquisadorUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Usuario.UsuarioResponseDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Pesquisador;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.service.PesquisadorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("api/v1/pesquisadores")
@RequiredArgsConstructor
public class PesquisadorController {

    private final PesquisadorService pesquisadorService;

    @PostMapping
    public ResponseEntity<PesquisadorResponseDTO> createPesquisador(@RequestBody PesquisadorCreateDTO pesquisadorDTO){
        Pesquisador novoPesquisador = pesquisadorService.createPesquisador(pesquisadorDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(novoPesquisador));
    }

    public PesquisadorResponseDTO toResponseDTO(Pesquisador pesquisador){
        PesquisadorResponseDTO dto = new PesquisadorResponseDTO();
        dto.setId(pesquisador.getId());
        dto.setNomeFicticio(pesquisador.getNomeFicticio());
        dto.setUsuario(toUsuarioResponseDTO(pesquisador.getUsuario()));

        return dto;
    }

    @GetMapping("{id}")
    public ResponseEntity<Pesquisador> getByID(@PathVariable Integer id){
        Pesquisador pesquisador = pesquisadorService.getById(id);
        return ResponseEntity.ok(pesquisador);
    }

    @GetMapping
    public ResponseEntity<List<PesquisadorResponseDTO>> listAll(){
        List<Pesquisador> pesquisadorList =pesquisadorService.listAll();

        List<PesquisadorResponseDTO> responseDTOS = pesquisadorList.stream()
                .map(this::toResponseDTO)
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseDTOS);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PesquisadorResponseDTO> updatePesquisador(@PathVariable Integer id, @RequestBody PesquisadorUpdateDTO pesquisadorDTO){
        Pesquisador pesquisadorAtualizado = pesquisadorService.updatePesquisador(id, pesquisadorDTO);
        return ResponseEntity.ok(toResponseDTO(pesquisadorAtualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Pesquisador> deletePesquisador(@PathVariable Integer id){
        pesquisadorService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private UsuarioResponseDTO toUsuarioResponseDTO(Usuario usuario) {
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
