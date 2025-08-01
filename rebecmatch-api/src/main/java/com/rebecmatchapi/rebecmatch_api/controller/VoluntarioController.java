package com.rebecmatchapi.rebecmatch_api.controller;

import com.rebecmatchapi.rebecmatch_api.dto.Usuario.UsuarioResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Voluntario.VoluntarioCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Voluntario.VoluntarioResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Voluntario.VoluntarioUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.entity.Voluntario;
import com.rebecmatchapi.rebecmatch_api.service.VoluntarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/voluntarios")
@RequiredArgsConstructor
public class VoluntarioController {

    private final VoluntarioService voluntarioService;

    @PostMapping
    public ResponseEntity<VoluntarioResponseDTO> createVoluntario(@RequestBody VoluntarioCreateDTO voluntarioDTO) {
        Voluntario novoVoluntario = voluntarioService.creteVoluntario(voluntarioDTO);
        // Retorna o DTO de resposta para proteger os dados
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(novoVoluntario));
    }

    private VoluntarioResponseDTO toResponseDTO(Voluntario voluntario) {
        VoluntarioResponseDTO dto = new VoluntarioResponseDTO();
        dto.setId(voluntario.getId());
        dto.setDistancia(voluntario.getDistancia());
        dto.setNomeFicticio(voluntario.getNomeFicticio());
        // Mapeia o usuário associado para o próprio DTO de resposta
        dto.setUsuario(toUsuarioResponseDTO(voluntario.getUsuario()));
        return dto;
    }

    @GetMapping("/{id}")
    public ResponseEntity<Voluntario> getById(@PathVariable Integer id){
        Voluntario voluntario = voluntarioService.getById(id);
        return ResponseEntity.ok(voluntario);
    }

    @GetMapping
    public ResponseEntity<List<VoluntarioResponseDTO>> listAll() {
        List<Voluntario> voluntarioList = voluntarioService.listAll();

        // Mapeia cada Voluntario da lista para o seu DTO de resposta
        List<VoluntarioResponseDTO> responseDTOs = voluntarioList.stream()
                .map(this::toResponseDTO) // Reutiliza o método de mapeamento
                .collect(Collectors.toList());

        return ResponseEntity.ok(responseDTOs);
    }

    @PutMapping("/{id}")
    public ResponseEntity<VoluntarioResponseDTO> updateVoluntario(@PathVariable Integer id, @RequestBody VoluntarioUpdateDTO voluntarioDTO){
        Voluntario voluntarioAtualizado = voluntarioService.updateVoluntario(id, voluntarioDTO);
        return ResponseEntity.ok(toResponseDTO(voluntarioAtualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Voluntario> deleteVoluntario(@PathVariable Integer id){
        voluntarioService.delete(id);
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
