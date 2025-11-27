package com.restaurant.commands.web.controller;

import java.time.LocalDateTime;
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
import com.restaurant.commands.model.CommandStatus;
import com.restaurant.commands.model.MenuItem;
import com.restaurant.commands.model.Order;
import com.restaurant.commands.model.User;
import com.restaurant.commands.repository.CommandRepository;
import com.restaurant.commands.repository.MenuItemRepository;
import com.restaurant.commands.repository.OrderRepository;
import com.restaurant.commands.repository.UserRepository;
import com.restaurant.commands.web.dto.CommandRequest;
import com.restaurant.commands.web.dto.OrderRequest;

@RestController
@RequestMapping("/api/comandas")
public class CommandController {

    private final CommandRepository commandRepository;
    private final UserRepository userRepository;
    private final MenuItemRepository menuItemRepository;
    private final OrderRepository orderRepository;

    public CommandController(CommandRepository commandRepository, UserRepository userRepository,
            MenuItemRepository menuItemRepository, OrderRepository orderRepository) {
        this.commandRepository = commandRepository;
        this.userRepository = userRepository;
        this.menuItemRepository = menuItemRepository;
        this.orderRepository = orderRepository;
    }

    @PostMapping
    public ResponseEntity<Command> openCommand(@RequestBody CommandRequest request) {
        User user = userRepository.findById(request.getResponsibleEmployeeId()).orElse(null);
        if (user == null) {
            return ResponseEntity.badRequest().build();
        }

        Command cmd = new Command();
        cmd.setTableNumber(request.getTableNumber());
        cmd.setResponsibleEmployee(user);
        cmd.setStatus(CommandStatus.OPEN);
        cmd.setOpenTime(LocalDateTime.now());
        cmd.setTotalValue(0.0);
        cmd.setCustomerName(request.getCustomerName());

        Command saved = commandRepository.save(cmd);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/fechar")
    public ResponseEntity<Command> closeCommand(@PathVariable Long id) {
        return commandRepository.findById(id).map(cmd -> {
            cmd.setStatus(CommandStatus.CLOSED);
            cmd.setCloseTime(LocalDateTime.now());
            commandRepository.save(cmd);
            return ResponseEntity.ok(cmd);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/{id}/pedidos")
    public ResponseEntity<?> addOrders(@PathVariable Long id, @RequestBody List<OrderRequest> requests) {
        return commandRepository.findById(id).map(cmd -> {
            double added = 0.0;
            for (OrderRequest r : requests) {
                MenuItem item = menuItemRepository.findById(r.getMenuItemId()).orElse(null);
                if (item == null)
                    continue;
                Order order = new Order();
                order.setMenuItem(item);
                order.setQuantity(r.getQuantity());
                order.setStatus(com.restaurant.commands.model.OrderStatus.PENDING);
                order.setOrderTime(LocalDateTime.now());
                order.setCommand(cmd);
                orderRepository.save(order);
                added += item.getPrice() * r.getQuantity();
            }
            cmd.setTotalValue(cmd.getTotalValue() + added);
            commandRepository.save(cmd);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/abertas")
    public ResponseEntity<List<com.restaurant.commands.web.dto.CommandDto>> listOpen() {
        List<Command> commands = commandRepository.findByStatus(CommandStatus.OPEN);
        List<com.restaurant.commands.web.dto.CommandDto> dtos = commands.stream().map(cmd -> {
            Long empId = null;
            String empName = null;
            if (cmd.getResponsibleEmployee() != null) {
                empId = cmd.getResponsibleEmployee().getId();
                empName = cmd.getResponsibleEmployee().getName();
            }
            return new com.restaurant.commands.web.dto.CommandDto(
                    cmd.getId(),
                    cmd.getTableNumber(),
                    cmd.getStatus().name(),
                    cmd.getTotalValue(),
                    cmd.getOpenTime(),
                    cmd.getCloseTime(),
                    empId,
                    empName,
                    cmd.getCustomerName());
        }).collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Command> get(@PathVariable Long id) {
        return commandRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCommand(@PathVariable Long id) {
        if (!commandRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        commandRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
