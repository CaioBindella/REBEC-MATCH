package com.rebecmatchapi.rebecmatch_api.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "pesquisador")
public class Pesquisador {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", referencedColumnName = "id", nullable = false, unique = true)
    private Usuario usuario;

    @Column(name = "nome_ficticio")
    private String nomeFicticio;

//    @OneToMany(mappedBy = "pesquisador", cascade = CascadeType.ALL)
//    private List<Estudo> estudos;
//
//    @OneToMany(mappedBy = "pesquisador", cascade = CascadeType.ALL)
//    private List<Busca> buscas;

}
