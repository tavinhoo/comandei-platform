package com.restaurant.commands.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.restaurant.commands.model.Command;
import com.restaurant.commands.model.CommandStatus;

@Repository
public interface CommandRepository extends JpaRepository<Command, Long> {
    @EntityGraph(attributePaths = {"responsibleEmployee"})
    List<Command> findByStatus(CommandStatus status);

    @EntityGraph(attributePaths = {"responsibleEmployee"})
    List<Command> findByStatusWithResponsibleEmployee(CommandStatus status);

    @EntityGraph(attributePaths = {"responsibleEmployee", "orders", "orders.menuItem"})
    @Query("select c from Command c where c.id = :id")
    Optional<Command> findWithDetailsById(Long id);

    List<Command> findByStatusAndCloseTimeBetween(CommandStatus status, LocalDateTime from, LocalDateTime to);
}
