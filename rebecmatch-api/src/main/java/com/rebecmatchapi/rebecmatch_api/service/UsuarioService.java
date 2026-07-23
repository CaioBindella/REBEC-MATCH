package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.dto.Usuario.UsuarioCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Usuario.UsuarioUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Pesquisador;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.entity.Voluntario;
import com.rebecmatchapi.rebecmatch_api.entity.enums.TipoEspecifico;
import com.rebecmatchapi.rebecmatch_api.entity.enums.TipoUsuario;
import com.rebecmatchapi.rebecmatch_api.exception.BusinessException;
import com.rebecmatchapi.rebecmatch_api.repository.PesquisadorRepository;
import com.rebecmatchapi.rebecmatch_api.repository.UsuarioRepository;
import com.rebecmatchapi.rebecmatch_api.repository.VoluntarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final PesquisadorRepository pesquisadorRepository;
    private final VoluntarioRepository voluntarioRepository;
    private final CepService cepService;
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
        novoUsuario.setCep(usuarioDTO.getCep());
        novoUsuario.setEndereco(usuarioDTO.getEndereco());
        novoUsuario.setDocumento(usuarioDTO.getDocumento());

        // Definição de valores padrão e de segurança
        novoUsuario.setTipo(TipoUsuario.USER); // Define o tipo padrão
        String hashedPassword = passwordEncoder.encode(usuarioDTO.getSenha());
        novoUsuario.setSenha(hashedPassword);

        Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);

        // Cria o perfil (Pesquisador ou Voluntário) automaticamente
        createProfileForUser(usuarioSalvo);

        return usuarioSalvo;
    }

    /**
     * Cria um perfil de Pesquisador ou Voluntário para um usuário recém-criado.
     * O usuário que acabou de ser salvo no banco de dados.
     */
    private void createProfileForUser(Usuario usuario) {
        String nomeFicticio = generateFictionalName(usuario);

        if (usuario.getTipoEspecifico() == TipoEspecifico.PESQUISADOR) {
            Pesquisador pesquisador = new Pesquisador();
            pesquisador.setUsuario(usuario);
            pesquisador.setNomeFicticio(nomeFicticio);
            pesquisadorRepository.save(pesquisador);
        } else if (usuario.getTipoEspecifico() == TipoEspecifico.VOLUNTARIO) {
            Voluntario voluntario = new Voluntario();
            voluntario.setUsuario(usuario);
            voluntario.setNomeFicticio(nomeFicticio);
            voluntario.setDistancia(0.0); // Valor padrão inicial
            voluntarioRepository.save(voluntario);
        }
    }

    public void alterarSenha(Integer id, String senhaAtual, String novaSenha) {
        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));

        if (!passwordEncoder.matches(senhaAtual, usuario.getSenha())) {
            throw new BusinessException("A senha atual informada está incorreta.");
        }

        usuario.setSenha(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);
    }

    /**
     * Gera um nome fictício com base no tipo de usuário, ID e CEP.
     * O usuário para o qual o nome será gerado.
     * Uma string no formato PREFIXO + ID + SUFIXO_ESTADO (ex: VOL243RJ).
     */
    private String generateFictionalName(Usuario usuario) {
        String prefix = usuario.getTipoEspecifico() == TipoEspecifico.PESQUISADOR ? "PS" : "VOL";
        String idPart = String.valueOf(usuario.getId());
        String suffix = cepService.getStateAbbreviation(usuario.getCep());
        return prefix + idPart + suffix;
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
        userValid.setCep(usuarioDTO.getCep());
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
    public void deleteUser(Integer id){
        usuarioRepository.deleteById(id);
    }
}
