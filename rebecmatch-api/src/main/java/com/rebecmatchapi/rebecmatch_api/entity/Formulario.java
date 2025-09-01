package com.rebecmatchapi.rebecmatch_api.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

/**
 * Entidade que representa um Formulário, que pertence a um Estudo.
 */
@Data
@Entity
@Table(name = "formulario")
public class Formulario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Relação N-para-1 com Estudo. Vários formulários podem pertencer a um estudo.
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estudo_id", nullable = false)
    private Estudo estudo;

    @Column(nullable = false)
    private String titulo;

    @Column(name = "texto_para_resposta_livre", columnDefinition = "TEXT")
    private String textoParaRespostaLivre;

    @Column(name = "data_criacao", nullable = false)
    private LocalDate dataCriacao = LocalDate.now();

    // Relação 1-para-N com Questao. Um formulário pode ter várias questões.
    @OneToMany(mappedBy = "formulario", cascade = CascadeType.ALL)
    private List<Questao> questoes;
}
