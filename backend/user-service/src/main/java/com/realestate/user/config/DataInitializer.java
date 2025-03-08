package com.realestate.user.config;

import com.realestate.user.model.Role;
import com.realestate.user.model.User;
import com.realestate.user.repository.RoleRepository;
import com.realestate.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.email:admin@realestate.com}")
    private String adminEmail;

    @Value("${app.admin.password:#{null}}")
    private String adminPassword;

    @Value("${app.admin.create:true}")
    private boolean createAdmin;

    @Override
    public void run(String... args) {
        // Initialize roles if they don't exist
        if (roleRepository.count() == 0) {
            log.info("Initializing roles...");
            createRole("ROLE_ADMIN");
            createRole("ROLE_AGENT");
            createRole("ROLE_CLIENT");
            log.info("Roles initialized successfully");
        }

        // Create admin user if it doesn't exist and is enabled in config
        if (createAdmin && adminPassword != null && !userRepository.existsByEmail(adminEmail)) {
            log.info("Creating admin user...");
            User adminUser = new User();
            adminUser.setName("System Admin");
            adminUser.setEmail(adminEmail);
            adminUser.setPassword(passwordEncoder.encode(adminPassword));
            adminUser.setEnabled(true);

            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseThrow(() -> new RuntimeException("Admin role not found"));

            adminUser.setRoles(Set.of(adminRole));
            userRepository.save(adminUser);

            log.info("Admin user created with email: {}", adminEmail);
        }
    }

    private void createRole(String name) {
        Role role = new Role();
        role.setName(name);
        roleRepository.save(role);
        log.debug("Created role: {}", name);
    }
}