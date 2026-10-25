package com.rebecmatchapi.rebecmatch_api.dto.Candidatura;

import com.rebecmatchapi.rebecmatch_api.entity.enums.StatusCandidatura;
import lombok.Data;

/**
 * Visão de um candidato exibida ao pesquisador. Contém apenas dados pseudonimizados
 * (nome fictício, idade, sexo e prefixo do CEP), nunca nome civil, e-mail, telefone ou documento.
 */
@Data
public class CandidatoDetalhadoDTO {
    private Integer candidaturaId;
    private Integer voluntarioId;          // id do perfil Voluntario (consulta das respostas do formulário)
    private Integer voluntarioUsuarioId;   // id do Usuario do voluntário (usado pelo serviço de chat)
    private String nomeFicticio;
    private Integer idade;
    private String sexo;
    private String localizacao;            // cinco primeiros dígitos do CEP
    private Integer estudoId;
    private String estudoTitulo;
    private StatusCandidatura status;
}
