package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.dto.Usuario.UsuarioCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Usuario.UsuarioUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.entity.enums.TipoUsuario;
import com.rebecmatchapi.rebecmatch_api.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    public Usuario createUser(UsuarioCreateDTO usuarioDTO){
        if (usuarioRepository.findByEmail(usuarioDTO.getEmail()).isPresent()){
            throw new RuntimeException("Email já cdastrado.");
        }

        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(usuarioDTO.getNome());
        novoUsuario.setSobrenome(usuarioDTO.getSobrenome());
        novoUsuario.setLogin(usuarioDTO.getLogin());
        novoUsuario.setEmail(usuarioDTO.getEmail());
        novoUsuario.setTipoEspecifico(usuarioDTO.getTipoEspecifico());
        novoUsuario.setSexo(usuarioDTO.getSexo());
        novoUsuario.setDataNascimento(usuarioDTO.getDataNascimento());
        novoUsuario.setTelefone(usuarioDTO.getTelefone());
        novoUsuario.setEndereco(usuarioDTO.getEndereco());
        novoUsuario.setDocumento(usuarioDTO.getDocumento());

        // Definição de valores padrão e de segurança
        novoUsuario.setTipo(TipoUsuario.USER); // Define o tipo padrão
        String hashedPassword = passwordEncoder.encode(usuarioDTO.getSenha());
        novoUsuario.setSenha(hashedPassword);

        return usuarioRepository.save(novoUsuario);
    }
    public Usuario updateUser(Integer id, UsuarioUpdateDTO usuarioDTO){
        Usuario userValid = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        userValid.setNome(usuarioDTO.getNome());
        userValid.setSobrenome(usuarioDTO.getSobrenome());
        userValid.setLogin(usuarioDTO.getLogin());
        userValid.setEmail(usuarioDTO.getEmail());
        userValid.setSenha(usuarioDTO.getSenha());
        userValid.setTipoEspecifico(usuarioDTO.getTipoEspecifico());
        userValid.setSexo(usuarioDTO.getSexo());
        userValid.setDataNascimento(usuarioDTO.getDataNascimento());
        userValid.setTelefone(usuarioDTO.getTelefone());
        userValid.setEndereco(usuarioDTO.getEndereco());
        userValid.setDocumento(usuarioDTO.getDocumento());

        if(usuarioDTO.getSenha() != null && !usuarioDTO.getSenha().isEmpty()){
            String hashedPassword = passwordEncoder.encode(usuarioDTO.getSenha());
            userValid.setSenha(hashedPassword);
        }

        return  usuarioRepository.save(userValid);
    }
    public Usuario getUserById(Integer id){
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
    }
    public List<Usuario> getAllUsers(){
        return usuarioRepository.findAll();
    }
    public void deleteUser(Integer id){
        usuarioRepository.deleteById(id);
    }
}
