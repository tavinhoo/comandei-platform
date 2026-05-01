package com.restaurant.commands.config;

import java.util.Arrays;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import com.restaurant.commands.model.Role;
import com.restaurant.commands.model.User;
import com.restaurant.commands.repository.UserRepository;

@Component
@ConditionalOnProperty(prefix = "app.seed", name = "enabled", havingValue = "true")
public class DatabaseSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DatabaseSeeder.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final String defaultPassword;

    public DatabaseSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder,
            @Value("${app.seed.default-password:}") String defaultPassword) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.defaultPassword = defaultPassword;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            return;
        }

        if (!StringUtils.hasText(defaultPassword)) {
            log.warn("Seed enabled, but APP_SEED_DEFAULT_PASSWORD is empty. Skipping seed.");
            return;
        }

        User manager = new User();
        manager.setName("Manager");
        manager.setEmail("manager@app.com");
        manager.setPassword(passwordEncoder.encode(defaultPassword));
        manager.setRole(Role.MANAGER);

        User employee = new User();
        employee.setName("Employee");
        employee.setEmail("employee@app.com");
        employee.setPassword(passwordEncoder.encode(defaultPassword));
        employee.setRole(Role.EMPLOYEE);

        userRepository.saveAll(Arrays.asList(manager, employee));
        log.info("Default users seeded for local environment");
    }
}
