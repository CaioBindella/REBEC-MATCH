package com.rebecmatchapi.rebecmatch_api.controller;

import com.rebecmatchapi.rebecmatch_api.dto.Notificacao.NotificacaoResponseDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Notificacao;
import com.rebecmatchapi.rebecmatch_api.service.NotificacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notificacoes")
@RequiredArgsConstructor
public class NotificacaoController {
    private final NotificacaoService service;

    @GetMapping("/usuario/{id}")
    public ResponseEntity<List<NotificacaoResponseDTO>> listar(@PathVariable Integer id) {
        List<Notificacao> lista = service.listarPorUsuario(id);

        // Converte a lista de Entidades para lista de DTOs manualmente ou usando Mapper
        List<NotificacaoResponseDTO> dtos = lista.stream().map(n -> {
            NotificacaoResponseDTO dto = new NotificacaoResponseDTO();
            dto.setId(n.getId());
            dto.setTitulo(n.getTitulo());
            dto.setMensagem(n.getMensagem());
            dto.setTipo(n.getTipo());
            dto.setLida(n.isLida());
            dto.setDataCriacao(n.getDataCriacao());
            dto.setUsuarioId(n.getUsuario().getId());
            return dto;
        }).toList();

        return ResponseEntity.ok(dtos);
    }

    @PatchMapping("/{id}/ler")
    public ResponseEntity<Void> marcarComoLida(@PathVariable Integer id) {
        service.marcarComoLida(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/usuario/{id}/ler-todas")
    public ResponseEntity<Void> marcarTodasComoLida(@PathVariable Integer id) {
        service.marcarLidas(id);

        return ResponseEntity.noContent().build();
    }
}
