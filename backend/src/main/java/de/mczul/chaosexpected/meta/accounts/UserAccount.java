package de.mczul.chaosexpected.meta.accounts;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import lombok.Value;
import org.hibernate.annotations.Immutable;

import java.util.UUID;

@Value
@EqualsAndHashCode(of = {"id"})
@ToString(onlyExplicitlyIncluded = true)
@Immutable
@Entity
@Table(schema = "meta", name = "user_accounts")
public class UserAccount {
    @Id
    @Column(name = "id")
    UUID id;
    @Column(name = "email")
    String email;
}
