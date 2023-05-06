package de.mczul.chaosexpected.api;

import com.fasterxml.jackson.databind.ObjectMapper;
import de.mczul.chaosexpected.AppRoles;
import de.mczul.chaosexpected.meta.projects.ProjectMapperImpl;
import de.mczul.chaosexpected.meta.projects.ProjectRepository;
import de.mczul.chaosexpected.meta.projects.registrations.RegistrationMapperImpl;
import de.mczul.chaosexpected.meta.projects.registrations.RegistrationRepository;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.DisplayNameGeneration;
import org.junit.jupiter.api.DisplayNameGenerator.ReplaceUnderscores;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.BDDMockito.any;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@DisplayName("API: /meta")
@DisplayNameGeneration(ReplaceUnderscores.class)
@WebMvcTest
class MetaControllerIT {
    @MockBean
    protected ProjectRepository projectRepository;
    @MockBean
    protected ProjectMapperImpl projectMapper;
    @MockBean
    protected RegistrationRepository registrationRepository;
    @MockBean
    protected RegistrationMapperImpl registrationMapper;

    @Autowired
    protected MockMvc mvc;

    @Nested
    class Projects {

        @Test
        @WithAnonymousUser
        void get_projects_must_be_denied_for_anonymous() throws Exception {
            // given

            // when
            mvc.perform(get("/meta/projects"))
                    // then
                    .andExpect(status().isUnauthorized())
                    .andExpect(content().string(""));
        }

        @Test
        @WithMockUser(roles = {AppRoles.ROLE_NAME_USER})
        void get_projects_must_be_denied_for_regular_users() throws Exception {
            // given
            final var serializer = new ObjectMapper();
            final var expectedContent = serializer.writeValueAsString(Page.empty());
            given(projectRepository.findAll(any(Pageable.class))).willReturn(Page.empty());

            // when
            mvc.perform(get("/meta/projects"))
                    // then
                    .andExpect(status().isForbidden())
                    .andExpect(content().string(""));
        }

        @Test
        @WithMockUser(roles = {AppRoles.ROLE_NAME_ADMIN})
        void get_projects_must_be_denied_for_admin_users() throws Exception {
            // given
            final var serializer = new ObjectMapper();
            final var expectedContent = serializer.writeValueAsString(Page.empty());
            given(projectRepository.findAll(any(Pageable.class))).willReturn(Page.empty());

            // when
            mvc.perform(get("/meta/projects"))
                    // then
                    .andExpect(status().isOk())
                    .andExpect(content().contentTypeCompatibleWith(MediaType.APPLICATION_JSON))
                    .andExpect(content().json(expectedContent));
        }

    }

}