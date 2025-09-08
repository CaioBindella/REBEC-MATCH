package com.rebecmatchapi.rebecmatch_api.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "match_result")
public class MatchResult {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "voluntario_id", nullable = false)
    private Voluntario voluntario;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estudo_id", nullable = false)
    private Estudo estudo;

    @Column(name = "criterios_atendidos", nullable = false)
    private int criteriosAtendidos;

    @Column(name = "justificativa", columnDefinition = "TEXT")
    private String justificativa;

    @CreationTimestamp
    @Column(name = "data_match", nullable = false, updatable = false)
    private LocalDateTime dataMatch;
}