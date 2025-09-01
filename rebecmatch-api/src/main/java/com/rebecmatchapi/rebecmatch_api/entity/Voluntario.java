package com.rebecmatchapi.rebecmatch_api.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Data
@Entity
@Table(name = "voluntario")
public class Voluntario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", referencedColumnName = "id", nullable = false, unique = true)
    private Usuario usuario;

    private double distancia;

    @Column(name = "nomeFicticio")
    private String nomeFicticio;

    @OneToMany(mappedBy = "voluntario")
    private List<Resposta> respostas;
}
