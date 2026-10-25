package com.rebecmatchapi.rebecmatch_api.repository;

import com.rebecmatchapi.rebecmatch_api.entity.MatchResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MatchResultRepository extends JpaRepository<MatchResult, Integer> {
    List<MatchResult> findByVoluntarioId(Integer voluntarioId);

    List<MatchResult> findByEstudoPesquisadorId(Integer pesquisadorId);
}
