package de.mczul.chaosexpected.meta.projects.registration;

import java.time.Instant;
import java.util.UUID;

public record RegistrationInfo(UUID id, UUID projectId, String emailAddress, Instant createdAt) {
}
