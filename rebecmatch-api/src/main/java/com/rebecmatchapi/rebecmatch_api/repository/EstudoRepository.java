package com.rebecmatchapi.rebecmatch_api.repository;

import com.rebecmatchapi.rebecmatch_api.entity.Estudo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EstudoRepository extends JpaRepository<Estudo, Integer> {

    // Método para encontrar estudos por status de recrutamento.
    List<Estudo> findByRecruitmentStatus(String status);

    boolean existsByTrialId(String trialId);

    Optional<Estudo> findByTrialId(String trialId);

    @Query("SELECT DISTINCT e FROM Estudo e " +
            "JOIN e.doencas d " +
            "WHERE LOWER(d.nomeCientifico) LIKE LOWER(CONCAT('%', :termo, '%')) " +
            "OR LOWER(d.nomePopular) LIKE LOWER(CONCAT('%', :termo, '%'))")
    List<Estudo> findByDoencaNome(@Param("termo") String termo);

    List<Estudo> findByPesquisadorId(Integer pesquisadorId);

    List<Estudo> findByRecruitmentStatusIgnoreCase(String status);
}

