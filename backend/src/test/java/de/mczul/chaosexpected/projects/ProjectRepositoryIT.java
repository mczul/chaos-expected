package de.mczul.chaosexpected.projects;

import de.mczul.chaosexpected.meta.projects.ProjectRepository;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.DisplayNameGenerator.ReplaceUnderscores;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.data.domain.Pageable;
import org.springframework.test.context.jdbc.Sql;

import java.time.Instant;

import static org.assertj.core.api.Assertions.*;

@DisplayName("Repositories: Project")
@DisplayNameGeneration(ReplaceUnderscores.class)
@DataJpaTest
class ProjectRepositoryIT {
    @Autowired
    protected ProjectRepository underTest;

    @Nested
    class Obsolete {

        @Test
        @Sql({
                "classpath:db/base.sql",
                "classpath:db/obsolete.sql",
        })
        void find_obsolete() {
            // given
            final var expected = underTest.findAll().stream()
                    .filter(project -> project.getEndsAt().isBefore(Instant.now()))
                    .toList();
            assertThat(expected).isNotEmpty();

            // when
            final var actual = underTest.findObsolete(Pageable.unpaged());

            // then
            assertThat(actual).containsExactlyInAnyOrderElementsOf(expected);
        }

    }

}