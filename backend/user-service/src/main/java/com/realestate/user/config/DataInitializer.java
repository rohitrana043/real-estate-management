package com.realestate.user.config;

import com.realestate.user.model.Role;
import com.realestate.user.model.User;
import com.realestate.user.repository.RoleRepository;
import com.realestate.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.util.Set;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Initialize roles if they don't exist
        if (roleRepository.count() == 0) {
            createRole("ROLE_ADMIN");
            createRole("ROLE_AGENT");
            createRole("ROLE_CLIENT");
        }
        // Create admin user if it doesn't exist
        if (!userRepository.existsByEmail("admin@realestate.com")) {
            User adminUser = new User();
            adminUser.setName("System Admin");
            adminUser.setEmail("admin@realestate.com");
            adminUser.setPassword(passwordEncoder.encode("Admin123!"));
            adminUser.setEnabled(true);

            Role adminRole = roleRepository.findByName("ROLE_ADMIN")
                    .orElseThrow(() -> new RuntimeException("Admin role not found"));

            adminUser.setRoles(Set.of(adminRole));
            userRepository.save(adminUser);

            System.out.println("Admin user created with email: admin@realestate.com");
        }
    }

    private void createRole(String name) {
        Role role = new Role();
        role.setName(name);
        roleRepository.save(role);
    }
}