package de.mczul.chaosexpected.accounts.registration;

import de.mczul.chaosexpected.projects.Project;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.Instant;
import java.util.UUID;

@Data
@ToString(onlyExplicitlyIncluded = true)
@EqualsAndHashCode(of = {"id"})
@Entity
@Table(schema = "meta", name = "registrations")
public class Registration {
    @Id
    @Column(name = "id")
    @ToString.Include
    protected UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    protected Project project;

    @Column(name = "email_address")
    @ToString.Include
    protected String emailAddress;

    @Column(name = "created_at")
    @ToString.Include
    protected Instant createdAt;

}
