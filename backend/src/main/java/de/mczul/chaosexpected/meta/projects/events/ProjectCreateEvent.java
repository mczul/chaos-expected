package de.mczul.chaosexpected.meta.projects.events;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;

import java.time.Instant;

@Builder
public record ProjectCreateEvent(
        @NotBlank String name,
        @NotBlank String description,
        @NotNull @Future Instant startsAt,
        @NotNull @Future Instant endsAt
) {
}
