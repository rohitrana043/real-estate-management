package com.realestate.contact.repository;

import com.realestate.contact.model.Newsletter;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface NewsletterRepository extends JpaRepository<Newsletter, Long> {
    Optional<Newsletter> findByEmail(String email);
    Optional<Newsletter> findByUnsubscribeToken(String token);
    boolean existsByEmail(String email);
}