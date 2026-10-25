package com.rebecmatchapi.rebecmatch_api.dto.Notificacao;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NotificacaoResponseDTO {
    private Integer id;
    private String titulo;
    private String mensagem;
    private String tipo;
    private boolean lida;
    private LocalDateTime dataCriacao;

    // Note que NÃO colocamos o objeto Usuario aqui, apenas o ID se fosse necessário
    private Integer usuarioId;
}