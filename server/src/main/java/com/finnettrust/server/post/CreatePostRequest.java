package com.finnettrust.server.post;

import jakarta.validation.constraints.NotBlank;

/**
 * Request body for POST /api/users/:userId/posts.
 */
public record CreatePostRequest(
        @NotBlank(message = "Must not be blank") String title,

        @NotBlank(message = "Must not be blank") String body) {
}