package de.mczul.chaosexpected.meta.projects.registrations.projections;

import de.mczul.chaosexpected.meta.projects.Project;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Value;
import org.hibernate.annotations.Immutable;

import java.time.Instant;
import java.util.UUID;

@Value
//@Immutable
//@Entity
//@Table()
public class RegistrationDetails {

    UUID id;
    Project project;
    String emailAddress;
    Instant createdAt;

}
