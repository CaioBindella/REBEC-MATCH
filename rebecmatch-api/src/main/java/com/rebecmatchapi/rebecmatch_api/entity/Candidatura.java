package com.rebecmatchapi.rebecmatch_api.entity;

import com.rebecmatchapi.rebecmatch_api.entity.enums.StatusCandidatura;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "candidatura")
public class Candidatura {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "voluntario_id", nullable = false)
    private Voluntario voluntario;

    @ManyToOne
    @JoinColumn(name = "estudo_id", nullable = false)
    private Estudo estudo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatusCandidatura status = StatusCandidatura.PENDENTE;

    @CreationTimestamp
    private LocalDateTime dataCandidatura;
}
