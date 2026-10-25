package com.rebecmatchapi.rebecmatch_api.entity;

import com.rebecmatchapi.rebecmatch_api.entity.enums.TipoQuestao;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.List;


/**
 * Entidade que representa uma Questão dentro de um Formulário.
 */
@Data
@Entity
@Table(name = "questao")
public class Questao {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Relação N-para-1 com Formulario. Várias questões pertencem a um formulário.
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "formulario_id", nullable = false)
    private Formulario formulario;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String texto;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoQuestao tipo;

    // Opções de resposta das questões do tipo OPCOES, em formato JSON (lista de textos)
    @Column(name = "opcoes", columnDefinition = "TEXT")
    private String opcoes;

    // Seção temática usada para agrupar as questões na exibição do formulário
    @Column(length = 100)
    private String secao;

    @Column(nullable = false)
    private boolean obrigatorio = false;

    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    @OneToMany(mappedBy = "questao")
    private List<Resposta> respostas;
}
