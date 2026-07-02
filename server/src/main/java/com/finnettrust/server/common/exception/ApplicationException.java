package com.finnettrust.server.common.exception;

import org.springframework.http.HttpStatus;

/**
 * Base type for every custom, defined application exception.
 */
public class ApplicationException extends RuntimeException {

    private final HttpStatus status;

    public ApplicationException(String message, HttpStatus status) {
        super(message);
        this.status = status;
    }

    public HttpStatus getHttpStatus() {
        return status;
    }

}
