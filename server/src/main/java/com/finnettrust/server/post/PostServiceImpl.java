package com.finnettrust.server.post;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.finnettrust.server.common.exception.ResourceNotFoundException;
import com.finnettrust.server.user.UserRepository;

import lombok.RequiredArgsConstructor;

/**
 * Depends on UserRepository only to validate the userId exists before returning
 * posts."
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final PostMapper postMapper;
    private final UserRepository userRepository;

    @Override
    public List<PostDto> findByUserId(UUID userId) {
        if (!userRepository.existsById(userId)) {
            throw ResourceNotFoundException.user();
        }
        return postRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(postMapper::toDto)
                .toList();
    }
}