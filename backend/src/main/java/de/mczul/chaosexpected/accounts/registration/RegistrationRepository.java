package de.mczul.chaosexpected.accounts.registration;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface RegistrationRepository extends JpaRepository<Registration, UUID> {

    Page<Registration> findAllByProject_Id(UUID projectId, Pageable pageable);

}
