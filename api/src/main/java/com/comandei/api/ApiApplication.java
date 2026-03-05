package com.comandei.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication(scanBasePackages = {"com.comandei.api", "com.restaurant.commands"})
@EnableJpaRepositories(basePackages = "com.restaurant.commands.repository")
@EntityScan(basePackages = "com.restaurant.commands.model")
@ComponentScan(basePackages = {"com.comandei.api", "com.restaurant.commands"})
public class ApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
    }

}
