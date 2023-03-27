package de.mczul.chaosexpected.api;

import de.mczul.chaosexpected.accounts.registration.RegistrationInfo;
import de.mczul.chaosexpected.accounts.registration.RegistrationMapper;
import de.mczul.chaosexpected.accounts.registration.RegistrationRepository;
import de.mczul.chaosexpected.accounts.registration.events.RegistrationCreateEvent;
import de.mczul.chaosexpected.projects.ProjectInfo;
import de.mczul.chaosexpected.projects.ProjectMapper;
import de.mczul.chaosexpected.projects.ProjectRepository;
import de.mczul.chaosexpected.projects.events.ProjectCreateEvent;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RequiredArgsConstructor
@RestController
@RequestMapping("meta")
public class MetaController {
    private final ProjectMapper projectMapper;
    private final ProjectRepository projectRepository;

    private final RegistrationMapper registrationMapper;
    private final RegistrationRepository registrationRepository;

    @GetMapping("projects")
    public Page<ProjectInfo> getProjects(Pageable pageable) {
        return projectRepository.findAll(pageable)
                .map(projectMapper::toInfo);
    }

    @Transactional
    @PostMapping("projects")
    public ResponseEntity<ProjectInfo> createProject(@Valid @RequestBody ProjectCreateEvent event) {
        return Optional.of(event)
                .map(projectMapper::from)
                .map(projectRepository::save)
                .map(projectMapper::toInfo)
                .map(ResponseEntity::ok)
                .orElseThrow();
    }

    @Transactional(readOnly = true)
    @GetMapping("projects/{projectId}")
    public ResponseEntity<ProjectInfo> getProject(@PathVariable UUID projectId) {
        return projectRepository.findById(projectId)
                .map(projectMapper::toInfo)
                .map(ResponseEntity::ok)
                .orElseThrow();
    }

    @Transactional
    @DeleteMapping("projects/{projectId}")
    public ResponseEntity<ProjectInfo> deleteProject(@PathVariable UUID projectId) {
        final var result = projectRepository.findById(projectId)
                .map(projectMapper::toInfo)
                .map(ResponseEntity::ok)
                .orElseThrow();
        projectRepository.deleteById(projectId);
        return result;
    }

    @Transactional
    @PostMapping("projects/{projectId}/registrations")
    public ResponseEntity<RegistrationInfo> createRegistration(
            @PathVariable UUID projectId,
            @Valid @RequestBody RegistrationCreateEvent event
    ) {
        return Optional.of(registrationMapper.from(projectId, event))
                .map(registrationRepository::save)
                .map(registrationMapper::toInfo)
                .map(ResponseEntity::ok)
                .orElseThrow();
    }

    @Transactional(readOnly = true)
    @GetMapping("projects/{projectId}/registrations")
    public Page<RegistrationInfo> getRegistrations(@PathVariable UUID projectId, Pageable pageable) {
        return registrationRepository.findAllByProjectId(projectId, pageable)
                .map(registrationMapper::toInfo);
    }

    @Transactional(readOnly = true)
    @GetMapping("projects/{projectId}/registrations/{registrationId}")
    public ResponseEntity<RegistrationInfo> getProject(@PathVariable UUID projectId, @PathVariable UUID registrationId) {
        return registrationRepository.findByProjectIdAndRegistrationId(projectId, registrationId)
                .map(registrationMapper::toInfo)
                .map(ResponseEntity::ok)
                .orElseThrow();
    }


}
