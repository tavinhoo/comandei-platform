package com.restaurant.commands.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.restaurant.commands.model.Role;
import com.restaurant.commands.model.User;
import com.restaurant.commands.repository.UserRepository;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public DatabaseSeeder(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            return; 
        }

        User manager = new User();
        manager.setName("Manager");
        manager.setEmail("manager@app.com");
        manager.setPassword(passwordEncoder.encode("123456"));
        manager.setRole(Role.MANAGER);

        User employee = new User();
        employee.setName("Employee");
        employee.setEmail("employee@app.com");
        employee.setPassword(passwordEncoder.encode("123456"));
        employee.setRole(Role.EMPLOYEE);

        userRepository.saveAll(Arrays.asList(manager, employee));
    }
}
