package com.rebecmatchapi.rebecmatch_api.service;

import com.rebecmatchapi.rebecmatch_api.dto.Usuario.UsuarioCreateDTO;
import com.rebecmatchapi.rebecmatch_api.dto.Usuario.UsuarioUpdateDTO;
import com.rebecmatchapi.rebecmatch_api.entity.Pesquisador;
import com.rebecmatchapi.rebecmatch_api.entity.Usuario;
import com.rebecmatchapi.rebecmatch_api.entity.Voluntario;
import com.rebecmatchapi.rebecmatch_api.entity.enums.TipoEspecifico;
import com.rebecmatchapi.rebecmatch_api.exception.BadRequestException;
import com.rebecmatchapi.rebecmatch_api.exception.BusinessException;
import com.rebecmatchapi.rebecmatch_api.exception.ResourceNotFoundException;
import com.rebecmatchapi.rebecmatch_api.repository.PesquisadorRepository;
import com.rebecmatchapi.rebecmatch_api.repository.UsuarioRepository;
import com.rebecmatchapi.rebecmatch_api.repository.VoluntarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UsuarioService {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final PesquisadorRepository pesquisadorRepository;
    private final VoluntarioRepository voluntarioRepository;
    private final CepService cepService;

    /**
     * Cria a conta e, na mesma transação, o perfil correspondente (Voluntario ou Pesquisador)
     * com o nome fictício gerado pelo sistema.
     */
    @Transactional
    public Usuario createUser(UsuarioCreateDTO usuarioDTO) {
        if (usuarioRepository.existsByEmail(usuarioDTO.getEmail().trim())) {
            throw new BusinessException("E-mail já cadastrado.");
        }
        if (usuarioRepository.existsByLogin(usuarioDTO.getLogin().trim())) {
            throw new BusinessException("Login já está em uso.");
        }
        // Idade e sexo são os atributos usados pela filtragem automática de compatibilidade
        if (usuarioDTO.getTipoEspecifico() == TipoEspecifico.VOLUNTARIO
                && (usuarioDTO.getDataNascimento() == null || usuarioDTO.getSexo() == null)) {
            throw new BadRequestException("Data de nascimento e sexo são obrigatórios para o cadastro de voluntários.");
        }

        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(usuarioDTO.getNome());
        novoUsuario.setSobrenome(usuarioDTO.getSobrenome());
        novoUsuario.setLogin(usuarioDTO.getLogin().trim());
        novoUsuario.setEmail(usuarioDTO.getEmail().trim());
        novoUsuario.setTipoEspecifico(usuarioDTO.getTipoEspecifico());
        novoUsuario.setSexo(usuarioDTO.getSexo());
        novoUsuario.setDataNascimento(usuarioDTO.getDataNascimento());
        novoUsuario.setTelefone(usuarioDTO.getTelefone());
        novoUsuario.setCep(vazioComoNulo(usuarioDTO.getCep()));
        novoUsuario.setEndereco(usuarioDTO.getEndereco());
        novoUsuario.setDocumento(usuarioDTO.getDocumento());
        novoUsuario.setSenha(passwordEncoder.encode(usuarioDTO.getSenha()));

        Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);
        criarPerfil(usuarioSalvo);
        return usuarioSalvo;
    }

    /**
     * Cria o perfil de Pesquisador ou Voluntário de um usuário recém-salvo. Usado também pela
     * importação automatizada de estudos, ao provisionar o contato científico de um ensaio.
     */
    public void criarPerfil(Usuario usuario) {
        String nomeFicticio = gerarNomeFicticio(usuario);

        if (usuario.getTipoEspecifico() == TipoEspecifico.PESQUISADOR) {
            Pesquisador pesquisador = new Pesquisador();
            pesquisador.setUsuario(usuario);
            pesquisador.setNomeFicticio(nomeFicticio);
            usuario.setPesquisador(pesquisadorRepository.save(pesquisador));
        } else if (usuario.getTipoEspecifico() == TipoEspecifico.VOLUNTARIO) {
            Voluntario voluntario = new Voluntario();
            voluntario.setUsuario(usuario);
            voluntario.setNomeFicticio(nomeFicticio);
            voluntario.setDistancia(0.0); // Valor padrão inicial
            usuario.setVoluntario(voluntarioRepository.save(voluntario));
        }
    }

    @Transactional
    public void alterarSenha(Integer id, String senhaAtual, String novaSenha) {
        Usuario usuario = getUserById(id);
        if (!passwordEncoder.matches(senhaAtual, usuario.getSenha())) {
            throw new BusinessException("A senha atual informada está incorreta.");
        }
        usuario.setSenha(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);
    }

    /**
     * Gera um nome fictício com base no tipo de usuário, ID e CEP, no formato
     * PREFIXO + ID + SIGLA_ESTADO (ex.: VOL243RJ, PS12SP).
     */
    String gerarNomeFicticio(Usuario usuario) {
        String prefix = usuario.getTipoEspecifico() == TipoEspecifico.PESQUISADOR ? "PS" : "VOL";
        return prefix + usuario.getId() + cepService.getStateAbbreviation(usuario.getCep());
    }

    /**
     * Atualiza os dados cadastrais. A senha é alterada apenas pelo endpoint próprio, com validação
     * da senha atual, e o tipo de perfil não muda depois do cadastro.
     */
    @Transactional
    public Usuario updateUser(Integer id, UsuarioUpdateDTO usuarioDTO) {
        Usuario userValid = getUserById(id);
        if (usuarioRepository.existsByEmailAndIdNot(usuarioDTO.getEmail().trim(), id)) {
            throw new BusinessException("E-mail já cadastrado.");
        }
        if (usuarioRepository.existsByLoginAndIdNot(usuarioDTO.getLogin().trim(), id)) {
            throw new BusinessException("Login já está em uso.");
        }

        userValid.setNome(usuarioDTO.getNome());
        userValid.setSobrenome(usuarioDTO.getSobrenome());
        userValid.setLogin(usuarioDTO.getLogin().trim());
        userValid.setEmail(usuarioDTO.getEmail().trim());
        userValid.setSexo(usuarioDTO.getSexo());
        userValid.setDataNascimento(usuarioDTO.getDataNascimento());
        userValid.setTelefone(usuarioDTO.getTelefone());
        userValid.setCep(vazioComoNulo(usuarioDTO.getCep()));
        userValid.setEndereco(usuarioDTO.getEndereco());
        userValid.setDocumento(usuarioDTO.getDocumento());
        return usuarioRepository.save(userValid);
    }

    @Transactional(readOnly = true)
    public Usuario getUserById(Integer id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));
    }

    /**
     * Exclui a conta e, em cascata, o perfil, as respostas, candidaturas, matches, notificações e
     * mensagens associadas (direito de exclusão dos dados previsto na LGPD).
     */
    @Transactional
    public void deleteUser(Integer id) {
        usuarioRepository.delete(getUserById(id));
    }

    private static String vazioComoNulo(String texto) {
        return texto == null || texto.isBlank() ? null : texto.trim();
    }
}
