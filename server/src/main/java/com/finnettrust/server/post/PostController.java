package com.finnettrust.server.post;

import java.util.List;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@Tag(name = "Posts", description = "Endpoints for browsing and creating posts")
@RestController
@RequestMapping("/api/users/{userId}/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    @Operation(summary = "List all posts for a user")
    @GetMapping
    public ResponseEntity<List<PostDto>> getPostsForUser(@PathVariable UUID userId) {
        return ResponseEntity.ok(postService.findByUserId(userId));
    }

    @Operation(summary = "Create a new post for a user")
    @PostMapping
    public ResponseEntity<PostDto> createPost(
            @PathVariable UUID userId,
            @Valid @RequestBody CreatePostRequest request) {
        PostDto created = postService.create(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

}
