package de.mczul.chaosexpected.accounts.registration;

import de.mczul.chaosexpected.accounts.registration.events.RegistrationCreateEvent;
import de.mczul.chaosexpected.common.IdLookupMapper;
import de.mczul.chaosexpected.projects.IdToProject;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.UUID;

@Mapper(uses = {IdLookupMapper.class})
public interface RegistrationMapper {

    RegistrationInfo toInfo(Registration domain);

    @Mapping(target = "id", expression = "java(UUID.randomUUID())")
    @Mapping(target = "project", source = "projectId", qualifiedBy = {IdToProject.class})
    Registration from(UUID projectId, RegistrationCreateEvent event);

}
