package com.rebecmatchapi.rebecmatch_api.controller;

import com.rebecmatchapi.rebecmatch_api.dto.Anuncio.AnuncioCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Anuncio.AnuncioResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Anuncio.AnuncioUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Anuncio;
import com.rebecmatchapi.rebecmatch_api.service.AnuncioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/anuncios")
@RequiredArgsConstructor
public class AnuncioController {

    private final AnuncioService anuncioService;

    @PostMapping
    public ResponseEntity<AnuncioResponseDTO> createAnuncio(@RequestBody AnuncioCreateDTO dto) {
        Anuncio novoAnuncio = anuncioService.createAnuncio(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(toResponseDTO(novoAnuncio));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AnuncioResponseDTO> getAnuncioById(@PathVariable Integer id) {
        Anuncio anuncio = anuncioService.getAnuncioById(id);
        return ResponseEntity.ok(toResponseDTO(anuncio));
    }

    @GetMapping
    public ResponseEntity<List<AnuncioResponseDTO>> getAllAnuncios() {
        List<Anuncio> anuncios = anuncioService.getAllAnuncios();
        List<AnuncioResponseDTO> dtos = anuncios.stream().map(this::toResponseDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PutMapping("/{id}")
    public ResponseEntity<AnuncioResponseDTO> updateAnuncio(@PathVariable Integer id, @RequestBody AnuncioUpdateDTO dto) {
        Anuncio anuncioAtualizado = anuncioService.updateAnuncio(id, dto);
        return ResponseEntity.ok(toResponseDTO(anuncioAtualizado));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAnuncio(@PathVariable Integer id) {
        anuncioService.deleteAnuncio(id);
        return ResponseEntity.noContent().build();
    }

    private AnuncioResponseDTO toResponseDTO(Anuncio anuncio) {
        AnuncioResponseDTO dto = new AnuncioResponseDTO();
        dto.setId(anuncio.getId());
        dto.setMensagem(anuncio.getMensagem());
        dto.setDataExpiracao(anuncio.getDataExpiracao());
        if (anuncio.getBusca() != null) {
            dto.setBuscaId(anuncio.getBusca().getId());
        }
        return dto;
    }
}
