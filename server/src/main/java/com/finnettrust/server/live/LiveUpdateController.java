package com.finnettrust.server.live;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@Tag(name = "Live", description = "Server-Sent Events for real-time post updates")
@RestController
@RequestMapping("/api/live")
@RequiredArgsConstructor
public class LiveUpdateController {

    private final SseEmitterRegistry registry;

    @Operation(summary = "Subscribe to live post-created events")
    @GetMapping(value = "/posts", produces = "text/event-stream")
    public SseEmitter streamPosts() {
        return registry.register();
    }

}
