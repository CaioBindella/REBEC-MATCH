package com.rebecmatchapi.rebecmatch_api.entity.enums;

public enum StatusCandidatura {
    PENDENTE,                       // Voluntário se candidatou (aguarda pesquisador)
    ACEITO_PELO_PESQUISADOR,        // Pesquisador aceitou (aguarda confirmação do voluntário)
    CONCLUIDO,                      // Voluntário confirmou (Chat aberto / Match salvo)
    RECUSADO                        // Recusado por qualquer uma das partes
}
