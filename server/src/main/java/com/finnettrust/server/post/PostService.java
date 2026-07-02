package com.finnettrust.server.post;

import java.util.List;
import java.util.UUID;

public interface PostService {
    /**
     * throws ResourceNotFoundException if no user exists with the given userId.
     */
    List<PostDto> findByUserId(UUID userId);
}