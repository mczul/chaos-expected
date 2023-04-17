package de.mczul.chaosexpected.meta.projects.registration;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface RegistrationRepository extends JpaRepository<Registration, UUID> {

    @Query("""
            SELECT reg
            FROM Registration reg
            WHERE reg.id = :registrationId
            AND reg.project.id = :projectId
            """)
    Optional<Registration> findByProjectIdAndRegistrationId(UUID projectId, UUID registrationId);

    @Query("""
            SELECT reg
            FROM Registration reg
            WHERE reg.project.id = :projectId
            """)
    Page<Registration> findAllByProjectId(UUID projectId, Pageable pageable);

}
