package com.rebecmatchapi.rebecmatch_api.repository;

import com.rebecmatchapi.rebecmatch_api.entity.Doenca;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DoencaRepository extends JpaRepository<Doenca, Long> {
    Optional<Doenca> findByCodigo(String codigo);
    boolean existsByCodigo(String codigo);
}
