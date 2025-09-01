package com.rebecmatchapi.rebecmatch_api.entity;

import com.rebecmatchapi.rebecmatch_api.entity.enums.Sexo;
import com.rebecmatchapi.rebecmatch_api.entity.enums.TipoEspecifico;
import com.rebecmatchapi.rebecmatch_api.entity.enums.TipoUsuario;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@Data
@Entity
@Table(name = "usuario")
public class Usuario implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(length = 50)
    private String nome;

    @Column(length = 50)
    private String sobrenome;

    @Column(unique = true, length = 50)
    private String login;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false)
    private String senha;

    // Este campo foi removido da V2 do banco de dados, mas é usado para o Spring Security
    // A role será definida com base na lógica da aplicação, não persistida diretamente da mesma forma.
    @Transient // Para não ser mapeado no banco
    private TipoUsuario tipo = TipoUsuario.USER;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipoEspecifico")
    private TipoEspecifico tipoEspecifico;

    @Enumerated(EnumType.STRING)
    private Sexo sexo;

    @Column(name = "data_nascimento")
    private LocalDate dataNascimento;

    @Column(length = 25)
    private String telefone;

    @Column(length = 8)
    private String cep;

    @Column(length = 255)
    private String endereco;

    @Column(length = 25)
    private String documento;

    private boolean tester = false;

    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Pesquisador pesquisador;

    @OneToOne(mappedBy = "usuario", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Voluntario voluntario;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        if(this.tipo == TipoUsuario.ADMIN) return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"), new SimpleGrantedAuthority("ROLE_USER"));
        else return List.of(new SimpleGrantedAuthority("ROLE_USER"));
    }
    @Override
    public String getPassword() {
        return senha;
    }
    @Override
    public String getUsername() {
        return login;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}