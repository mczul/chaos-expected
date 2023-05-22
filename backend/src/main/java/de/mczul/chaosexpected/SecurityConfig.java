package de.mczul.chaosexpected;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

import static org.springframework.boot.autoconfigure.security.servlet.PathRequest.toH2Console;

@Slf4j
@Configuration
public class SecurityConfig {

    @PostConstruct
    void init() {
        log.warn("Security config initialized.");
    }

    @Bean
    @Order(1)
    @ConditionalOnProperty(name = "spring.h2.console.enabled", havingValue = "true")
    SecurityFilterChain h2FilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity.securityMatcher(toH2Console())

                .csrf().disable()

                .headers(headers -> headers.frameOptions().sameOrigin())

                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())

                .build();
    }

    @Bean
    @Order(2)
    SecurityFilterChain defaultFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .csrf().and()
                .cors().and()
                .rememberMe().and()

                .formLogin().permitAll().and()
                .logout().permitAll().and()
                .httpBasic().realmName("Chaos Expected").and()

                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.GET, "/meta/projects").hasRole(AppRoles.ROLE_NAME_ADMIN)
                        .anyRequest().authenticated()
                )

                .build();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    InMemoryUserDetailsManager userDetailsService() {
        final UserDetails user = User.withDefaultPasswordEncoder()
                .username("user")
                .password("password")
                .roles(AppRoles.USER.name())
                .build();
        final UserDetails admin = User.withDefaultPasswordEncoder()
                .username("admin")
                .password("password")
                .roles(AppRoles.ADMIN.name())
                .build();
        return new InMemoryUserDetailsManager(user, admin);
    }
}
