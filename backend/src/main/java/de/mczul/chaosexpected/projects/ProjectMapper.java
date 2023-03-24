package de.mczul.chaosexpected.projects;

import de.mczul.chaosexpected.projects.events.ProjectCreateEvent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper
public interface ProjectMapper {

    ProjectInfo toInfo(Project domain);

    @Mapping(target = "id", expression = "java(UUID.randomUUID())")
    @Mapping(target = "createdAt", expression = "java(Instant.now())")
    Project from(ProjectCreateEvent event);

}
