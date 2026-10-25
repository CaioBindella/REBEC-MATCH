package com.rebecmatchapi.rebecmatch_api.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.LocalDate;
import java.util.List;

/**
 * Entidade que representa um Formulário. Pode pertencer a um Estudo ou ser global
 * (estudo nulo), como o formulário de perfil inicial preenchido por todo voluntário.
 */
@Data
@Entity
@Table(name = "formulario")
public class Formulario {
    /** Identificador fixo do formulário de perfil inicial, criado pela migração V8. */
    public static final int ID_FORMULARIO_PERFIL = 1;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Relação N-para-1 com Estudo. Vários formulários podem pertencer a um estudo.
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "estudo_id", nullable = true)
    private Estudo estudo;

    @Column(nullable = false)
    private String titulo;

    @Column(name = "texto_para_resposta_livre", columnDefinition = "TEXT")
    private String textoParaRespostaLivre;

    @Column(name = "data_criacao", nullable = false)
    private LocalDate dataCriacao = LocalDate.now();

    // Relação 1-para-N com Questao. Um formulário pode ter várias questões.
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "formulario", cascade = CascadeType.ALL)
    private List<Questao> questoes;
}
