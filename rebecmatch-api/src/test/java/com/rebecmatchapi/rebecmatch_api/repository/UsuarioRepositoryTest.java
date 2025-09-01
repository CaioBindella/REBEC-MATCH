package com.rebecmatchapi.rebecmatch_api.repository;

import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

@DataJpaTest
@ActiveProfiles("test")
class UsuarioRepositoryTest {

//    @Autowired
//    EntityManager entityManager;
//    @Autowired
//    UsuarioRepository usuarioRepository;
//    @Test
//    void findByEmail() {
//    }
//
//    @Test
//    @DisplayName("Should get User successfully from DB")
//    void findByLoginCase1() {
//        // 1. Arrange: Crie os dados de teste usando setters
//        String login = "teste.login";
//        UsuarioCreateDTO data = new UsuarioCreateDTO();
//        data.setNome("Usuario");
//        data.setSobrenome("Teste");
//        data.setLogin(login);
//        data.setEmail("teste@email.com");
//        data.setSenha("senha123");
//        data.setTipoEspecifico(TipoEspecifico.PESQUISADOR); // Use o Enum
//        data.setSexo(Sexo.MASCULINO); // Use o Enum
//        data.setDataNascimento(OffsetDateTime.now()); // Use OffsetDateTime
//        data.setTelefone("21999999999");
//        data.setEndereco("Rua Exemplo, 123");
//        data.setDocumento("123.456.789-00");
//
//        this.createUser(data);
//
//        // 2. Act: Execute a ação que quer testar
//        Optional<Usuario> resultado = this.usuarioRepository.findByLogin(login);
//
//        // 3. Assert: Verifique se o resultado é o esperado
//        assertThat(resultado).isPresent(); // Verifica se um usuário foi encontrado
//        assertThat(resultado.get().getLogin()).isEqualTo(login); // Verifica se o login é o correto
//    }
//
//    private Usuario createUser(UsuarioCreateDTO usuarioDTO){
//        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
//
//        Usuario novoUsuario = new Usuario();
//        novoUsuario.setNome(usuarioDTO.getNome());
//        novoUsuario.setSobrenome(usuarioDTO.getSobrenome());
//        novoUsuario.setLogin(usuarioDTO.getLogin());
//        novoUsuario.setEmail(usuarioDTO.getEmail());
//        novoUsuario.setTipoEspecifico(usuarioDTO.getTipoEspecifico());
//        novoUsuario.setSexo(usuarioDTO.getSexo());
//        novoUsuario.setDataNascimento(usuarioDTO.getDataNascimento());
//        novoUsuario.setTelefone(usuarioDTO.getTelefone());
//        novoUsuario.setEndereco(usuarioDTO.getEndereco());
//        novoUsuario.setDocumento(usuarioDTO.getDocumento());
//
//        // Definição de valores padrão e de segurança
//        novoUsuario.setTipo(TipoUsuario.USER); // Define o tipo padrão
//        String hashedPassword = passwordEncoder.encode(usuarioDTO.getSenha());
//        novoUsuario.setSenha(hashedPassword);
//
//        this.entityManager.persist(novoUsuario);
//        return novoUsuario;
//    }
}