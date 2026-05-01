package com.restaurant.commands.web.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.commands.model.Command;
import com.restaurant.commands.service.CommandService;
import com.restaurant.commands.web.dto.CommandRequest;
import com.restaurant.commands.web.dto.CommandDto;
import com.restaurant.commands.web.dto.OrderRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/comandas")
public class CommandController {

    private final CommandService commandService;

    public CommandController(CommandService commandService) {
        this.commandService = commandService;
    }

    @PostMapping
    public ResponseEntity<CommandDto> openCommand(@Valid @RequestBody CommandRequest request) {
        return ResponseEntity.ok(toDto(commandService.openCommand(request)));
    }

    @PutMapping("/{id}/fechar")
    public ResponseEntity<CommandDto> closeCommand(@PathVariable Long id) {
        return ResponseEntity.ok(toDto(commandService.closeCommand(id)));
    }

    @PostMapping("/{id}/pedidos")
    public ResponseEntity<CommandDto> addOrders(@PathVariable Long id,
            @RequestBody List<@Valid OrderRequest> requests) {
        return ResponseEntity.ok(toDto(commandService.addOrders(id, requests)));
    }

    @GetMapping("/abertas")
    public ResponseEntity<List<CommandDto>> listOpen() {
        List<CommandDto> dtos = commandService.listOpenCommands().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Command> get(@PathVariable Long id) {
        return ResponseEntity.ok(commandService.getCommandDetails(id));
    }

    private CommandDto toDto(Command command) {
        Long employeeId = command.getResponsibleEmployee() != null ? command.getResponsibleEmployee().getId() : null;
        String employeeName = command.getResponsibleEmployee() != null ? command.getResponsibleEmployee().getName() : null;
        return new CommandDto(
                command.getId(),
                command.getTableNumber(),
                command.getStatus().name(),
                command.getTotalValue(),
                command.getOpenTime(),
                command.getCloseTime(),
                employeeId,
                employeeName);
    }
}
