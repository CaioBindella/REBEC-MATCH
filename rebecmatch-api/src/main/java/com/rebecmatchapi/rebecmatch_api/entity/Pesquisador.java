package com.rebecmatchapi.rebecmatch_api.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.List;

@Data
@Entity
@Table(name = "pesquisador")
public class Pesquisador {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    // Lado dono da relação 1-para-1 com Usuario.
    // A anotação @JoinColumn cria a chave estrangeira 'usuario_id'.
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", referencedColumnName = "id", nullable = false, unique = true)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Usuario usuario;

    @Column(name = "nomeFicticio")
    private String nomeFicticio;

    // Relação 1-para-N com Estudo. Um pesquisador pode ter vários estudos.
    @OneToMany(mappedBy = "pesquisador", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Estudo> estudos;

    // Relação 1-para-N com Busca. Um pesquisador pode ter várias buscas.
    @OneToMany(mappedBy = "pesquisador", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Busca> buscas;
}
