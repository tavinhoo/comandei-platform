package com.restaurant.commands.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.restaurant.commands.model.Command;
import com.restaurant.commands.model.CommandStatus;

@Repository
public interface CommandRepository extends JpaRepository<Command, Long> {
    List<Command> findByStatus(CommandStatus status);
    List<Command> findByStatusAndCloseTimeBetween(CommandStatus status, LocalDateTime from, LocalDateTime to);
}
