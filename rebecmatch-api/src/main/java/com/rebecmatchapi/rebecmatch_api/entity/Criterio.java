package com.rebecmatchapi.rebecmatch_api.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "criterio")
public class Criterio {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estudo_id", nullable = false)
    private Estudo estudo;

    @Column(name = "inclusion_criteria", columnDefinition = "TEXT", nullable = false)
    private String inclusionCriteria;

    @Column(name = "agemin", nullable = false, length = 20)
    private String ageMin;

    @Column(name = "agemax", nullable = false, length = 20)
    private String ageMax;

    @Column(length = 20, nullable = false)
    private String gender;

    @Column(name = "exclusion_criteria", columnDefinition = "TEXT", nullable = false)
    private String exclusionCriteria;
}