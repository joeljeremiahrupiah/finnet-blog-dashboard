package com.finnettrust.server.post;

/**
 * Published after a post is committed to the database. Decouples the write path
 * (PostServiceImpl.create) from the live update path (SseController).
 */
public record PostCreatedEvent(PostDto post) {
}