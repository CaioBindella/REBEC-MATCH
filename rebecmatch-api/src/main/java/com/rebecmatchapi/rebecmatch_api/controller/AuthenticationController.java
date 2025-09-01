package com.rebecmatchapi.rebecmatch_api.controller;

import com.rebecmatchapi.rebecmatch_api.dto.Usuario.UsuarioResponseDTO;
import com.rebecmatchapi.rebecmatch_api.dto.auth.AuthenticationDTO;
import com.rebecmatchapi.rebecmatch_api.dto.auth.LoginResponseDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.entity.enums.TipoEspecifico;
import com.rebecmatchapi.rebecmatch_api.service.TokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthenticationController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody AuthenticationDTO data){
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.login(), data.senha());
        var auth = this.authenticationManager.authenticate(usernamePassword);

        var usuario = (Usuario) auth.getPrincipal();
        var token = tokenService.generateToken(usuario);

        UsuarioResponseDTO usuarioDTO = toUsuarioResponseDTO(usuario);
        Integer perfilId = null;
        String nomeFicticio = null;

        if (usuario.getTipoEspecifico() == TipoEspecifico.PESQUISADOR && usuario.getPesquisador() != null) {
            perfilId = usuario.getPesquisador().getId();
            nomeFicticio = usuario.getPesquisador().getNomeFicticio();
        } else if (usuario.getTipoEspecifico() == TipoEspecifico.VOLUNTARIO && usuario.getVoluntario() != null) {
            perfilId = usuario.getVoluntario().getId();
            nomeFicticio = usuario.getVoluntario().getNomeFicticio();
        }

        return ResponseEntity.ok(new LoginResponseDTO(token, usuarioDTO, nomeFicticio));
    }

    private UsuarioResponseDTO toUsuarioResponseDTO(Usuario usuario) {
        if (usuario == null) return null;
        UsuarioResponseDTO dto = new UsuarioResponseDTO();
        dto.setId(usuario.getId());
        dto.setNome(usuario.getNome());
        dto.setSobrenome(usuario.getSobrenome());
        dto.setLogin(usuario.getLogin());
        dto.setEmail(usuario.getEmail());
        dto.setTipoEspecifico(usuario.getTipoEspecifico());
        dto.setSexo(usuario.getSexo());
        dto.setTester(usuario.isTester());
        return dto;
    }
}
