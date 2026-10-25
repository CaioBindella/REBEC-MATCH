package com.rebecmatchapi.rebecmatch_api.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "doencas")
@Getter
@Setter
@NoArgsConstructor
public class Doenca {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // O código (ex: D02.241...) será único
    @Column(unique = true, nullable = false)
    private String codigo;

    @Column(columnDefinition = "TEXT")
    private String nomeCientifico; // Coluna "text" do Excel

    @Column(columnDefinition = "TEXT")
    private String nomePopular; // Coluna "Nomes Populares" do Excel

    private String vocabulario; // ICD-10, DeCS, etc.

    @ManyToMany(mappedBy = "doencas")
    @JsonIgnore
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Set<Estudo> estudos = new HashSet<>();

    public Doenca(String codigo, String nomeCientifico, String nomePopular, String vocabulario) {
        this.codigo = codigo;
        this.nomeCientifico = nomeCientifico;
        this.nomePopular = nomePopular;
        this.vocabulario = vocabulario;
    }
}
