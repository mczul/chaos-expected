package de.mczul.chaosexpected.meta.projects;

import de.mczul.chaosexpected.meta.projects.events.ProjectCreateEvent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper
public interface ProjectMapper {

    ProjectInfo toInfo(Project domain);

    @Mapping(target = "id", expression = "java(UUID.randomUUID())")
    @Mapping(target = "registrations", ignore = true)
    @Mapping(target = "createdAt", expression = "java(Instant.now())")
    Project from(ProjectCreateEvent event);

}
