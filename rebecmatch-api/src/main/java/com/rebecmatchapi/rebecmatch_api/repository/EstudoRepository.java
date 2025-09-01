package com.rebecmatchapi.rebecmatch_api.repository;

import com.rebecmatchapi.rebecmatch_api.entity.Estudo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EstudoRepository extends JpaRepository<Estudo, Integer> {
    // Método para encontrar estudos por status de recrutamento.
    List<Estudo> findByRecruitmentStatus(String status);
}

