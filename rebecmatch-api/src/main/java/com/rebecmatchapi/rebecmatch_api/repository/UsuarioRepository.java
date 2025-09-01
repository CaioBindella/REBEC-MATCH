package com.rebecmatchapi.rebecmatch_api.repository;

import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
    Optional<Usuario> findByEmail(String email);
    UserDetails findByLogin(String login);

//    Optional<Usuario> findByLogin(String login);
}
