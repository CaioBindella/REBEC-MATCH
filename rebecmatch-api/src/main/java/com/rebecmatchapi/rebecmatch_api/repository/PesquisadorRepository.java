package com.rebecmatchapi.rebecmatch_api.repository;

import com.rebecmatchapi.rebecmatch_api.entity.Pesquisador;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PesquisadorRepository extends JpaRepository<Pesquisador, Integer> {
    Optional<Pesquisador> findByUsuarioId(Integer usuarioId);
}
