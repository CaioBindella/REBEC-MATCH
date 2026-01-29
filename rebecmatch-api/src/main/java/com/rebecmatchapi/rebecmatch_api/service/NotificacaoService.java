package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.entity.Notificacao;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.repository.NotificacaoRepository;
import com.rebecmatchapi.rebecmatch_api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificacaoService {
    private final NotificacaoRepository repository;
    private final UsuarioRepository usuarioRepository;

    public void criarNotificacao(Integer usuarioId, String titulo, String tipo, String mensagem) {
        Usuario usuario = usuarioRepository.findById(usuarioId).orElseThrow();
        Notificacao notif = new Notificacao();
        notif.setUsuario(usuario);
        notif.setTitulo(titulo);
        notif.setTipo(tipo);
        notif.setMensagem(mensagem);
        repository.save(notif);
    }

    public List<Notificacao> listarPorUsuario(Integer usuarioId) {
        return repository.findByUsuarioIdOrderByDataCriacaoDesc(usuarioId);
    }

    public void marcarComoLida(Integer id) {
        Notificacao n = repository.findById(id).orElseThrow();
        n.setLida(true);
        repository.save(n);
    }

    public void marcarLidas(Integer usuarioId) {
        List<Notificacao> list = repository.findByUsuarioIdOrderByDataCriacaoDesc(usuarioId);
        list.forEach(n -> n.setLida(true));
        repository.saveAll(list);
    }
}