package com.finnettrust.server.post;

import java.time.Instant;
import java.util.UUID;

public record PostDto(
        UUID id,
        UUID userId,
        String title,
        String body,
        Instant createdAt,
        Instant updatedAt) {
}