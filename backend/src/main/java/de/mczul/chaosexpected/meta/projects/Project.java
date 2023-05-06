package de.mczul.chaosexpected.meta.projects;

import de.mczul.chaosexpected.meta.projects.registrations.Registration;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.Instant;
import java.util.Set;
import java.util.UUID;

@Data
@EqualsAndHashCode(of = {"id"})
@ToString(onlyExplicitlyIncluded = true)
@Entity
@Table(schema = "meta", name = "projects")
public class Project {
    @Id
    @Column(name = "id")
    @ToString.Include
    protected UUID id;

    @Column(name = "name")
    @ToString.Include
    protected String name;

    @Column(name = "description")
    protected String description;

    @OneToMany(mappedBy = "project")
    protected Set<Registration> registrations;

    @Column(name = "created_at")
    @ToString.Include
    protected Instant createdAt;

    @Column(name = "starts_at")
    @ToString.Include
    protected Instant startsAt;

    @Column(name = "ends_at")
    @ToString.Include
    protected Instant endsAt;

}
