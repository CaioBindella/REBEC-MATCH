package com.rebecmatchapi.rebecmatch_api.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@Table(name = "estudo")
public class Estudo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pesquisador_id", nullable = false)
    private Pesquisador pesquisador;

    @Column(name = "public_title", nullable = false)
    private String publicTitle;

    @Column(name = "scientific_title", nullable = false)
    private String scientificTitle;

    @Column(name = "recruitment_status", nullable = false)
    private String recruitmentStatus;

    @Column(name = "study_type", nullable = false)
    private String studyType;

    @Column(nullable = false)
    private String phase;

    @Column(name = "date_registration", nullable = false)
    private LocalDate dateRegistration;

    @Column(name = "date_enrolment", nullable = false)
    private LocalDate dateEnrolment;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String url;

    @Column(name = "primary_sponsor", nullable = false)
    private String primarySponsor;

    @Column(name = "hc_freetext", nullable = false)
    private String hcFreetext;

    @Column(name = "i_freetext", nullable = false)
    private String iFreetext;

    @Column(name = "approval_date", nullable = false)
    private String approvalDate;

    @Column(name = "sec_id", nullable = false)
    private String secId;

    @Column(name = "trial_id", nullable = false)
    private String trialId;

    @OneToMany(mappedBy = "estudo", cascade = CascadeType.ALL)
    private List<Formulario> formularios;

    @OneToMany(mappedBy = "estudo", cascade = CascadeType.ALL)
    private List<Criterio> criterios;

    @OneToMany(mappedBy = "estudo", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private List<Busca> buscas;
}