package de.mczul.chaosexpected.meta.registrations;

import java.time.Instant;
import java.util.UUID;

public record RegistrationInfo(UUID id, UUID projectId, String emailAddress, Instant createdAt) {
}
