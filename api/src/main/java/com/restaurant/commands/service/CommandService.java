package com.restaurant.commands.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.restaurant.commands.exception.ApiException;
import com.restaurant.commands.model.Command;
import com.restaurant.commands.model.CommandStatus;
import com.restaurant.commands.model.MenuItem;
import com.restaurant.commands.model.Order;
import com.restaurant.commands.model.OrderStatus;
import com.restaurant.commands.model.User;
import com.restaurant.commands.repository.CommandRepository;
import com.restaurant.commands.repository.MenuItemRepository;
import com.restaurant.commands.repository.OrderRepository;
import com.restaurant.commands.repository.UserRepository;
import com.restaurant.commands.web.dto.CommandRequest;
import com.restaurant.commands.web.dto.OrderRequest;

@Service
public class CommandService {

    private final CommandRepository commandRepository;
    private final UserRepository userRepository;
    private final MenuItemRepository menuItemRepository;
    private final OrderRepository orderRepository;

    public CommandService(CommandRepository commandRepository, UserRepository userRepository,
            MenuItemRepository menuItemRepository, OrderRepository orderRepository) {
        this.commandRepository = commandRepository;
        this.userRepository = userRepository;
        this.menuItemRepository = menuItemRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional
    public Command openCommand(CommandRequest request) {
        User user = userRepository.findById(request.getResponsibleEmployeeId())
                .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST, "Responsible employee not found"));

        Command command = new Command();
        command.setTableNumber(request.getTableNumber());
        command.setResponsibleEmployee(user);
        command.setStatus(CommandStatus.OPEN);
        command.setOpenTime(LocalDateTime.now());
        command.setTotalValue(0.0);
        return commandRepository.save(command);
    }

    @Transactional
    public Command closeCommand(Long id) {
        Command command = getExistingCommand(id);
        if (command.getStatus() == CommandStatus.CLOSED) {
            throw new ApiException(HttpStatus.CONFLICT, "Command is already closed");
        }

        command.setStatus(CommandStatus.CLOSED);
        command.setCloseTime(LocalDateTime.now());
        return commandRepository.save(command);
    }

    @Transactional
    public Command addOrders(Long id, List<OrderRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "At least one order item is required");
        }

        Command command = getExistingCommand(id);
        if (command.getStatus() != CommandStatus.OPEN) {
            throw new ApiException(HttpStatus.CONFLICT, "Orders can only be added to open commands");
        }

        double addedTotal = 0.0;
        for (OrderRequest request : requests) {
            MenuItem item = menuItemRepository.findById(request.getMenuItemId())
                    .orElseThrow(() -> new ApiException(HttpStatus.BAD_REQUEST,
                            "Menu item not found: " + request.getMenuItemId()));

            if (!Boolean.TRUE.equals(item.getIsActive())) {
                throw new ApiException(HttpStatus.BAD_REQUEST,
                        "Menu item is inactive: " + request.getMenuItemId());
            }

            Order order = new Order();
            order.setMenuItem(item);
            order.setQuantity(request.getQuantity());
            order.setStatus(OrderStatus.PENDING);
            order.setOrderTime(LocalDateTime.now());
            order.setCommand(command);
            orderRepository.save(order);
            addedTotal += item.getPrice() * request.getQuantity();
        }

        command.setTotalValue(command.getTotalValue() + addedTotal);
        return commandRepository.save(command);
    }

    @Transactional(readOnly = true)
    public List<Command> listOpenCommands() {
        return commandRepository.findByStatusWithResponsibleEmployee(CommandStatus.OPEN);
    }

    @Transactional(readOnly = true)
    public Command getCommandDetails(Long id) {
        return commandRepository.findWithDetailsById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Command not found"));
    }

    private Command getExistingCommand(Long id) {
        return commandRepository.findById(id)
                .orElseThrow(() -> new ApiException(HttpStatus.NOT_FOUND, "Command not found"));
    }
}
