package de.mczul.chaosexpected.meta.projects;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

    @Query("""
            SELECT p
            FROM Project p
            WHERE p.endsAt < current_timestamp
            """)
    Page<Project> findObsolete(Pageable pageable);

}
