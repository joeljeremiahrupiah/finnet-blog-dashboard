package com.finnettrust.server.user;

import java.time.Instant;
import java.util.UUID;

/**
 * Immutable record object representing the API-facing shape.
 */
public record UserDto(
        UUID id,
        String name,
        String email,
        String companyName,
        String addressCity,
        String addressStreet,
        Instant createdAt,
        Instant updatedAt) {
}