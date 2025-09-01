package com.rebecmatchapi.rebecmatch_api.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "busca")
public class Busca {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String nome;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pesquisador_id", nullable = false)
    private Pesquisador pesquisador;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estudo_id", nullable = false)
    private Estudo estudo;

    @OneToMany(mappedBy = "busca", cascade = CascadeType.ALL)
    private List<Anuncio> anuncios;

    @OneToMany(mappedBy = "busca", cascade = CascadeType.ALL)
    private List<Resposta> respostas;

}

