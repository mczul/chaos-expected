package de.mczul.chaosexpected.accounts.registration;

import de.mczul.chaosexpected.projects.Project;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import java.util.UUID;

@Data
@ToString(onlyExplicitlyIncluded = true)
@EqualsAndHashCode(of = {"id"})
@Entity
@Table(schema = "meta", name = "registrations")
public class Registration {
    @Id
    @Column(name = "id")
    protected UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    protected Project project;

    @Column(name = "email_address")
    protected String emailAddress;


}
