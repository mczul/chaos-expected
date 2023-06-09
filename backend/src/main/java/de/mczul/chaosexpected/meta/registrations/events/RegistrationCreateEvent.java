package de.mczul.chaosexpected.meta.registrations.events;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegistrationCreateEvent(@NotBlank @Email String emailAddress) {
}
