package com.rebecmatchapi.rebecmatch_api.controller;

import com.rebecmatchapi.rebecmatch_api.dto.DtoMapper;
import com.rebecmatchapi.rebecmatch_api.dto.auth.AuthenticationDTO;
import com.rebecmatchapi.rebecmatch_api.dto.auth.LoginResponseDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.entity.enums.TipoEspecifico;
import com.rebecmatchapi.rebecmatch_api.service.TokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    /**
     * Valida as credenciais e devolve, em uma única resposta, o token JWT, os dados da conta e o
     * identificador do perfil específico (id de Voluntario ou de Pesquisador).
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody AuthenticationDTO data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.login(), data.senha());
        var auth = this.authenticationManager.authenticate(usernamePassword);

        var usuario = (Usuario) auth.getPrincipal();
        var token = tokenService.generateToken(usuario);

        Integer perfilId = null;
        String nomeFicticio = null;
        if (usuario.getTipoEspecifico() == TipoEspecifico.PESQUISADOR && usuario.getPesquisador() != null) {
            perfilId = usuario.getPesquisador().getId();
            nomeFicticio = usuario.getPesquisador().getNomeFicticio();
        } else if (usuario.getTipoEspecifico() == TipoEspecifico.VOLUNTARIO && usuario.getVoluntario() != null) {
            perfilId = usuario.getVoluntario().getId();
            nomeFicticio = usuario.getVoluntario().getNomeFicticio();
        }

        return ResponseEntity.ok(new LoginResponseDTO(token, DtoMapper.toUsuario(usuario), nomeFicticio, perfilId));
    }
}
