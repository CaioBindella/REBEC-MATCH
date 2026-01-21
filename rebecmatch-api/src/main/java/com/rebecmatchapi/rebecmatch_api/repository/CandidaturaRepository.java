package com.rebecmatchapi.rebecmatch_api.repository;

import com.rebecmatchapi.rebecmatch_api.entity.Candidatura;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CandidaturaRepository extends JpaRepository<Candidatura, Integer> {
    List<Candidatura> findByVoluntarioId(Integer voluntarioId);
    List<Candidatura> findByEstudoId(Integer estudoId);

    // Para evitar candidatura duplicada
    boolean existsByVoluntarioIdAndEstudoId(Integer voluntarioId, Integer estudoId);
}
