package com.restaurant.commands.web.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.commands.model.CommandStatus;
import com.restaurant.commands.service.CommandService;
import com.restaurant.commands.web.dto.CommandDetailDto;
import com.restaurant.commands.web.dto.CommandDto;
import com.restaurant.commands.web.dto.CommandRequest;
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
    public ResponseEntity<CommandDetailDto> openCommand(@Valid @RequestBody CommandRequest request,
            Authentication authentication) {
        String username = authentication != null ? authentication.getName() : null;
        return ResponseEntity.ok(commandService.openCommand(request, username));
    }

    @PutMapping("/{id}/fechar")
    public ResponseEntity<CommandDetailDto> closeCommand(@PathVariable Long id) {
        return ResponseEntity.ok(commandService.closeCommand(id));
    }

    @PutMapping("/{id}/cancelar")
    public ResponseEntity<CommandDetailDto> cancelCommand(@PathVariable Long id) {
        return ResponseEntity.ok(commandService.cancelCommand(id));
    }

    @PostMapping("/{id}/pedidos")
    public ResponseEntity<CommandDetailDto> addOrders(@PathVariable Long id,
            @Valid @RequestBody List<OrderRequest> requests) {
        return ResponseEntity.ok(commandService.addOrders(id, requests));
    }

    @GetMapping
    public ResponseEntity<List<CommandDto>> listByStatus(
            @RequestParam(defaultValue = "OPEN") CommandStatus status) {
        return ResponseEntity.ok(commandService.listByStatus(status));
    }

    @GetMapping("/historico")
    public ResponseEntity<List<CommandDto>> listHistory() {
        return ResponseEntity.ok(commandService.listHistory());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CommandDetailDto> get(@PathVariable Long id) {
        return ResponseEntity.ok(commandService.getById(id));
    }

    @DeleteMapping("/historico")
    public ResponseEntity<Void> clearHistory() {
        commandService.clearHistory();
        return ResponseEntity.noContent().build();
    }
}
