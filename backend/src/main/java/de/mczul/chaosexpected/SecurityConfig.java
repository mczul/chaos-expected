package de.mczul.chaosexpected;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Slf4j
@Configuration
public class SecurityConfig {

    @PostConstruct
    void init() {
      log.warn("Security config initialized.");
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                // default
                .securityMatcher("/meta/**")
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll()
                )

                .httpBasic().realmName("Chaos Expected").and()
                .csrf().disable()

                .build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    public InMemoryUserDetailsManager userDetailsService(PasswordEncoder passwordEncoder) {
        UserDetails user = User.withDefaultPasswordEncoder()
                .username("user")
                .password("password")
                .roles(AppRoles.USER.name())
                .build();
        return new InMemoryUserDetailsManager(user);
    }
}
