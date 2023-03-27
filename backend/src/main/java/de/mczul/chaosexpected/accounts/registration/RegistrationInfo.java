package de.mczul.chaosexpected.accounts.registration;

import java.time.Instant;
import java.util.UUID;

public record RegistrationInfo(UUID id, UUID projectId, String emailAddress, Instant createdAt) {
}
