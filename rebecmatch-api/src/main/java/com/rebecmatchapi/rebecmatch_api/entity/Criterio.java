package com.rebecmatchapi.rebecmatch_api.entity;

import com.rebecmatchapi.rebecmatch_api.entity.enums.GeneroElegivel;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

@Data
@Entity
@Table(name = "criterio")
public class Criterio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estudo_id", nullable = false)
    private Estudo estudo;

    @Column(name = "inclusion_criteria", columnDefinition = "TEXT", nullable = false)
    private String inclusionCriteria;

    @Column(name = "agemin", nullable = false, length = 20)
    private String ageMin;

    @Column(name = "agemax", nullable = false, length = 20)
    private String ageMax;

    // Sexo aceito pelo estudo, já normalizado para o domínio do enum Sexo (ver GeneroElegivel).
    @Enumerated(EnumType.STRING)
    @Column(length = 20, nullable = false)
    private GeneroElegivel gender = GeneroElegivel.AMBOS;

    @Column(name = "exclusion_criteria", columnDefinition = "TEXT", nullable = false)
    private String exclusionCriteria;
}