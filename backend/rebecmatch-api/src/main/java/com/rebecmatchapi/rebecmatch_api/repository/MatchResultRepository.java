package com.rebecmatchapi.rebecmatch_api.repository;

import com.rebecmatchapi.rebecmatch_api.entity.MatchResult;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MatchResultRepository extends JpaRepository<MatchResult, Integer> {
    List<MatchResult> findByVoluntarioId(Integer voluntarioId);

    List<MatchResult> findByEstudoPesquisadorId(Integer pesquisadorId);
}
