package com.finnettrust.server.live;

import org.springframework.stereotype.Component;
import org.springframework.transaction.event.TransactionPhase;
import org.springframework.transaction.event.TransactionalEventListener;

import com.finnettrust.server.post.PostCreatedEvent;

import lombok.RequiredArgsConstructor;

/**
 * Listens only after the write transaction commits. Avoids broadcasting a post
 * to clients before it's durably saved.
 */
@Component
@RequiredArgsConstructor
public class PostEventListener {

    private final SseEmitterRegistry registry;

    @TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
    public void onPostCreated(PostCreatedEvent event) {
        registry.broadcast("post-created", event.post());
    }

}
