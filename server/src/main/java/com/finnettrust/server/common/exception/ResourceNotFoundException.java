package com.finnettrust.server.common.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when a requested resource does not exist.
 */
public class ResourceNotFoundException extends ApplicationException {

    private ResourceNotFoundException(String message) {
        super(message, HttpStatus.NOT_FOUND);
    }

    public static ResourceNotFoundException user() {
        return new ResourceNotFoundException("User not found");
    }

    public static ResourceNotFoundException post() {
        return new ResourceNotFoundException("Post not found");
    }
}