package com.rebecmatchapi.rebecmatch_api.repository;

import com.rebecmatchapi.rebecmatch_api.entity.Resposta;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface RespostaRepository extends JpaRepository<Resposta, Integer> {
    List<Resposta> findByVoluntarioId(Integer voluntarioId);

    List<Resposta> findByVoluntarioIdAndQuestaoFormularioId(
            Integer voluntarioId, Integer formularioId);

    boolean existsByVoluntarioIdAndQuestaoFormularioId(Integer voluntarioId, Integer formularioId);
}
