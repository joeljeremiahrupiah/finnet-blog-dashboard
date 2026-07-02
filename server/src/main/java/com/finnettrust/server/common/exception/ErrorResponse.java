package com.finnettrust.server.common.exception;

import java.time.Instant;

/**
 * Standard error shape for general errors.
 */
public record ErrorResponse(
        int status,
        String error,
        String message,
        Instant timestamp) {
    public static ErrorResponse of(int status, String error, String message) {
        return new ErrorResponse(status, error, message, Instant.now());
    }
}