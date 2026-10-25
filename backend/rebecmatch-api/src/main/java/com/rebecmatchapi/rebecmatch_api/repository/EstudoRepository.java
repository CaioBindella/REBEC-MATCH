package com.rebecmatchapi.rebecmatch_api.repository;

import com.rebecmatchapi.rebecmatch_api.entity.Estudo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EstudoRepository extends JpaRepository<Estudo, Integer> {

    boolean existsByTrialId(String trialId);

    /**
     * Busca estudos pelo nome científico ou popular das doenças associadas (vocabulário controlado)
     * e, como complemento, pelo texto livre de condição de saúde do próprio estudo. O complemento
     * alcança estudos cujos códigos não constam no vocabulário e estudos cadastrados manualmente.
     */
    @Query("SELECT DISTINCT e FROM Estudo e " +
            "LEFT JOIN e.doencas d " +
            "WHERE LOWER(d.nomeCientifico) LIKE LOWER(CONCAT('%', :termo, '%')) " +
            "OR LOWER(d.nomePopular) LIKE LOWER(CONCAT('%', :termo, '%')) " +
            "OR LOWER(e.hcFreetext) LIKE LOWER(CONCAT('%', :termo, '%'))")
    List<Estudo> findByDoencaNome(@Param("termo") String termo);

    List<Estudo> findByPesquisadorId(Integer pesquisadorId);

    List<Estudo> findByRecruitmentStatusIgnoreCase(String status);
}
