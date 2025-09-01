package com.rebecmatchapi.rebecmatch_api.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Data
@Entity
@Table(name = "anuncio")
public class Anuncio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "busca_id", nullable = false)
    private Busca busca;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String mensagem;

    @Column(name = "data_expiracao", nullable = false)
    private LocalDate dataExpiracao;
}
