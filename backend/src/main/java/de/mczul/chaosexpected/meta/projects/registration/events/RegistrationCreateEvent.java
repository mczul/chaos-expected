package de.mczul.chaosexpected.meta.projects.registration.events;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegistrationCreateEvent(@NotBlank @Email String emailAddress) {
}
