package com.finnettrust.server.post;

import jakarta.validation.constraints.NotBlank;
import java.util.List;
import java.util.UUID;

public interface PostService {

    /**
     * throws ResourceNotFoundException if no user exists with the given userId.
     */
    List<PostDto> findByUserId(UUID userId);
    PostDto create(UUID userId, CreatePostRequest request);
}