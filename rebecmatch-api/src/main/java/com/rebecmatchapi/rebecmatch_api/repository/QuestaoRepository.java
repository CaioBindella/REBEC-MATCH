package com.rebecmatchapi.rebecmatch_api.repository;

import com.rebecmatchapi.rebecmatch_api.entity.Questao;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestaoRepository extends JpaRepository<Questao, Integer> {
    List<Questao> findByFormularioId(Integer formularioId);

    // Ordem de exibição do formulário
    List<Questao> findByFormularioIdOrderByIdAsc(Integer formularioId);
}
