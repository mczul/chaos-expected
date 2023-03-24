package de.mczul.chaosexpected.projects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.time.Instant;
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
