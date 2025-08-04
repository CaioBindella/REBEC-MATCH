package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class AuthorizationService implements UserDetailsService {
    @Autowired
    private UsuarioRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        System.out.println("--- PROCURANDO UTILIZADOR PELO LOGIN: " + username); // <-- Adicione esta linha
        UserDetails user = repository.findByLogin(username);

        if (user == null) {
            System.out.println("--- UTILIZADOR NÃO ENCONTRADO!"); // <-- Adicione esta linha
            throw new UsernameNotFoundException("Utilizador não encontrado com o login: " + username);
        }

        System.out.println("--- UTILIZADOR ENCONTRADO: " + user.getUsername()); // <-- Adicione esta linha
        return user;
    }
}
