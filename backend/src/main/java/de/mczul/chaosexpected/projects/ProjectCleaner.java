package de.mczul.chaosexpected.projects;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.data.domain.Sort.Direction;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class ProjectCleaner {

    protected final ProjectRepository projectRepository;

    /**
     * Run cleanup every full hour
     */
    @Scheduled(cron = "0 0 * * * *")
    public void cleanup() {
        final var pageSize = 10;

        projectRepository.findObsolete(PageRequest.of(0, pageSize, Sort.by(Direction.ASC, "endsAt")))
                .map(Project::getId)
                .forEach(projectRepository::deleteById);
    }

}
