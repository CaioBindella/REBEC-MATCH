package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.entity.Notificacao;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.exception.ForbiddenException;
import com.rebecmatchapi.rebecmatch_api.exception.ResourceNotFoundException;
import com.rebecmatchapi.rebecmatch_api.repository.NotificacaoRepository;
import com.rebecmatchapi.rebecmatch_api.repository.UsuarioRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.PlatformTransactionManager;
import org.springframework.transaction.TransactionDefinition;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.support.TransactionSynchronization;
import org.springframework.transaction.support.TransactionSynchronizationManager;
import org.springframework.transaction.support.TransactionTemplate;

import java.util.List;

@Service
public class NotificacaoService {

    public static final String TIPO_INFO = "info";
    public static final String TIPO_SUCESSO = "success";

    private static final Logger logger = LoggerFactory.getLogger(NotificacaoService.class);

    private final NotificacaoRepository repository;
    private final UsuarioRepository usuarioRepository;
    private final TransactionTemplate transacaoPropria;

    public NotificacaoService(NotificacaoRepository repository, UsuarioRepository usuarioRepository,
                              PlatformTransactionManager transactionManager) {
        this.repository = repository;
        this.usuarioRepository = usuarioRepository;
        this.transacaoPropria = new TransactionTemplate(transactionManager);
        this.transacaoPropria.setPropagationBehavior(TransactionDefinition.PROPAGATION_REQUIRES_NEW);
    }

    /**
     * Agenda uma notificação para depois da confirmação (commit) da transação corrente, gravando-a
     * em uma transação própria. Assim, uma notificação só é criada se a operação que a originou foi
     * efetivamente persistida, e uma falha no envio da notificação é apenas registrada em log, sem
     * desfazer a operação principal (por exemplo, o registro de uma candidatura).
     */
    public void notificar(Integer usuarioId, String titulo, String tipo, String mensagem) {
        Runnable envio = () -> {
            try {
                transacaoPropria.executeWithoutResult(status -> criarNotificacao(usuarioId, titulo, tipo, mensagem));
            } catch (RuntimeException e) {
                logger.warn("Falha ao registrar notificação para o usuário {}: {}", usuarioId, e.getMessage());
            }
        };
        if (TransactionSynchronizationManager.isSynchronizationActive()) {
            TransactionSynchronizationManager.registerSynchronization(new TransactionSynchronization() {
                @Override
                public void afterCommit() {
                    envio.run();
                }
            });
        } else {
            envio.run();
        }
    }

    private void criarNotificacao(Integer usuarioId, String titulo, String tipo, String mensagem) {
        Usuario usuario = usuarioRepository.findById(usuarioId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário " + usuarioId + " não encontrado."));
        Notificacao notif = new Notificacao();
        notif.setUsuario(usuario);
        notif.setTitulo(titulo);
        notif.setTipo(tipo);
        notif.setMensagem(mensagem);
        repository.save(notif);
    }

    public List<Notificacao> listarPorUsuario(Integer usuarioId, Usuario usuarioLogado) {
        exigirTitular(usuarioId, usuarioLogado);
        return repository.findByUsuarioIdOrderByDataCriacaoDesc(usuarioId);
    }

    @Transactional
    public void marcarComoLida(Integer id, Usuario usuarioLogado) {
        Notificacao n = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notificação com ID " + id + " não encontrada."));
        exigirTitular(n.getUsuario().getId(), usuarioLogado);
        n.setLida(true);
        repository.save(n);
    }

    @Transactional
    public void marcarLidas(Integer usuarioId, Usuario usuarioLogado) {
        exigirTitular(usuarioId, usuarioLogado);
        List<Notificacao> list = repository.findByUsuarioIdOrderByDataCriacaoDesc(usuarioId);
        list.forEach(n -> n.setLida(true));
        repository.saveAll(list);
    }

    private void exigirTitular(Integer usuarioId, Usuario usuarioLogado) {
        if (!usuarioLogado.getId().equals(usuarioId)) {
            throw new ForbiddenException("Você só pode acessar as suas próprias notificações.");
        }
    }
}
