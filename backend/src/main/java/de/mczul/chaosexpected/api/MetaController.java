package de.mczul.chaosexpected.api;

import de.mczul.chaosexpected.projects.ProjectInfo;
import de.mczul.chaosexpected.projects.ProjectMapper;
import de.mczul.chaosexpected.projects.ProjectRepository;
import de.mczul.chaosexpected.projects.events.ProjectCreateEvent;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RequiredArgsConstructor
@RestController
@RequestMapping("meta")
public class MetaController {
    private final ProjectMapper projectMapper;
    private final ProjectRepository projectRepository;

    @GetMapping("projects")
    public Page<ProjectInfo> getProjects(Pageable pageable) {
        return projectRepository.findAll(pageable)
                .map(projectMapper::toInfo);
    }

    @PostMapping("projects")
    public ResponseEntity<ProjectInfo> createProject(@Valid @RequestBody ProjectCreateEvent event) {
        return Optional.of(event)
                .map(projectMapper::from)
                .map(projectRepository::save)
                .map(projectMapper::toInfo)
                .map(ResponseEntity::ok)
                .orElseThrow();
    }

}
