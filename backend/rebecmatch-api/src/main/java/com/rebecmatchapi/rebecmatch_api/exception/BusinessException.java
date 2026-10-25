package com.rebecmatchapi.rebecmatch_api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Exceção para violações de regras de negócio.
 * Retorna o status HTTP 409 Conflict.
 */
@ResponseStatus(HttpStatus.CONFLICT)
public class BusinessException extends RuntimeException{
    public BusinessException(String message){
        super(message);
    }
}
