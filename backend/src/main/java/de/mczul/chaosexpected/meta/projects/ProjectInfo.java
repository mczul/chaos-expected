package de.mczul.chaosexpected.meta.projects;

import java.time.Instant;
import java.util.UUID;

public record ProjectInfo(
        UUID id,
        String name,
        String description,
        Instant createdAt,
        Instant startsAt,
        Instant endsAt
) {
}
