package com.restaurant.commands.web.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.commands.model.Command;
import com.restaurant.commands.model.CommandStatus;
import com.restaurant.commands.repository.CommandRepository;

@RestController
@RequestMapping("/api/relatorios")
public class ReportController {

    private final CommandRepository commandRepository;

    public ReportController(CommandRepository commandRepository) {
        this.commandRepository = commandRepository;
    }

    @GetMapping("/faturamento")
    public ResponseEntity<Double> revenue(
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {

        LocalDateTime start = (from == null) ? LocalDate.now().atStartOfDay() : from.atStartOfDay();
        LocalDateTime end = (to == null) ? LocalDateTime.now() : to.atTime(LocalTime.MAX);

        List<Command> closed = commandRepository.findByStatusAndCloseTimeBetween(CommandStatus.CLOSED, start, end);
        double sum = closed.stream().mapToDouble(Command::getTotalValue).sum();
        return ResponseEntity.ok(sum);
    }
}
