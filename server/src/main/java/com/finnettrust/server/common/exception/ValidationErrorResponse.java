package com.finnettrust.server.common.exception;

import java.time.Instant;
import java.util.Map;

/**
 * Error shape for 400s from Bean Validation failures.
 */
public record ValidationErrorResponse(
        int status,
        String error,
        String message,
        Instant timestamp,
        Map<String, String> fieldErrors) {
    public static ValidationErrorResponse of(Map<String, String> fieldErrors) {
        return new ValidationErrorResponse(400, "Bad Request", "Validation failed", Instant.now(), fieldErrors);
    }
}