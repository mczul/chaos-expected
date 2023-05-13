package de.mczul.chaosexpected.common;

import de.mczul.chaosexpected.meta.registrations.IdToRegistration;
import de.mczul.chaosexpected.meta.registrations.Registration;
import de.mczul.chaosexpected.meta.projects.IdToProject;
import de.mczul.chaosexpected.meta.projects.Project;
import jakarta.persistence.EntityManager;
import org.mapstruct.Mapper;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.UUID;

@Mapper
public abstract class IdLookupMapper {
    @Autowired
    private EntityManager entityManager;

    @IdToProject
    public Project toProject(UUID id) {
        return entityManager.getReference(Project.class, id);
    }

    @IdToRegistration
    public Registration toRegistration(UUID id) {
        return entityManager.getReference(Registration.class, id);
    }

}
