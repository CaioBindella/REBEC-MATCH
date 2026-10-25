package com.rebecmatchapi.rebecmatch_api.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import java.time.LocalDateTime;

@Entity
@Data
@Table(name = "notificacoes")
public class Notificacao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToOne
    @JoinColumn(name = "usuario_id")
    @JsonIgnore
    private Usuario usuario; // Quem recebe a notificação

    private String titulo;
    @Column(columnDefinition = "TEXT")
    private String mensagem;
    private String tipo = "info";
    private boolean lida = false;
    private LocalDateTime dataCriacao = LocalDateTime.now();
}