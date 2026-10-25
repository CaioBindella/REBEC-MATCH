package com.rebecmatchapi.rebecmatch_api.controller;

import com.rebecmatchapi.rebecmatch_api.dto.DtoMapper;
import com.rebecmatchapi.rebecmatch_api.dto.Notificacao.NotificacaoResponseDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.service.NotificacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/notificacoes")
@RequiredArgsConstructor
public class NotificacaoController {
    private final NotificacaoService service;

    @GetMapping("/usuario/{id}")
    public ResponseEntity<List<NotificacaoResponseDTO>> listar(@PathVariable Integer id,
                                                               @AuthenticationPrincipal Usuario usuario) {
        return ResponseEntity.ok(service.listarPorUsuario(id, usuario).stream().map(DtoMapper::toNotificacao).toList());
    }

    @PatchMapping("/{id}/ler")
    public ResponseEntity<Void> marcarComoLida(@PathVariable Integer id, @AuthenticationPrincipal Usuario usuario) {
        service.marcarComoLida(id, usuario);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/usuario/{id}/ler-todas")
    public ResponseEntity<Void> marcarTodasComoLida(@PathVariable Integer id, @AuthenticationPrincipal Usuario usuario) {
        service.marcarLidas(id, usuario);
        return ResponseEntity.noContent().build();
    }
}
