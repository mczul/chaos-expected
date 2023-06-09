package de.mczul.chaosexpected.meta.registrations;

import de.mczul.chaosexpected.meta.registrations.events.RegistrationCreateEvent;
import de.mczul.chaosexpected.common.IdLookupMapper;
import de.mczul.chaosexpected.meta.projects.IdToProject;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.UUID;

@Mapper(uses = {IdLookupMapper.class})
public interface RegistrationMapper {

    @Mapping(target = "projectId", source = "project.id")
    RegistrationInfo toInfo(Registration domain);

    @Mapping(target = "id", expression = "java(UUID.randomUUID())")
    @Mapping(target = "project", source = "projectId", qualifiedBy = {IdToProject.class})
    @Mapping(target = "createdAt", expression = "java(Instant.now())")
    Registration from(UUID projectId, RegistrationCreateEvent event);

}
