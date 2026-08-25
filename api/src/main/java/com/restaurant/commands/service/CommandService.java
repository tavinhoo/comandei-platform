package com.restaurant.commands.service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.restaurant.commands.exception.ApiException;
import com.restaurant.commands.exception.ResourceNotFoundException;
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
import com.restaurant.commands.web.dto.CommandDetailDto;
import com.restaurant.commands.web.dto.CommandDto;
import com.restaurant.commands.web.dto.CommandRequest;
import com.restaurant.commands.web.dto.OrderRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Service
public class CommandService {
    private static final Logger logger = LoggerFactory.getLogger(CommandService.class);

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
    public CommandDetailDto openCommand(CommandRequest request, String username) {
        // Verifica se já existe uma comanda aberta para a mesa informada
        boolean exists = commandRepository.existsByTableNumberAndStatus(request.getTableNumber(), CommandStatus.OPEN);
        if (exists) {
            throw new ApiException(HttpStatus.CONFLICT, "Já existe uma comanda aberta para a mesa " + request.getTableNumber());
        }
        User user = null;
        if (request.getResponsibleEmployeeId() != null) {
            user = userRepository.findById(request.getResponsibleEmployeeId())
                    .orElse(null);
        }
        if (user == null && username != null && !username.isBlank()) {
            user = userRepository.findByEmail(username).orElse(null);
        }

        Command command = new Command();
        command.setTableNumber(request.getTableNumber());
        command.setCustomerName(request.getCustomerName());
        command.setResponsibleEmployee(user);
        command.setStatus(CommandStatus.OPEN);
        command.setOpenTime(LocalDateTime.now());
        command.setTotalValue(BigDecimal.ZERO);

        Command saved = commandRepository.save(command);
        return toDetailDto(saved);
    }

    @Transactional
    public CommandDetailDto closeCommand(Long id) {
        Command command = getExistingCommand(id);
        if (command.getStatus() == CommandStatus.CLOSED) {
            throw new ApiException(HttpStatus.CONFLICT, "Command is already closed");
        }
        if (command.getStatus() == CommandStatus.CANCELED) {
            throw new ApiException(HttpStatus.CONFLICT, "Cannot close a canceled command");
        }

        command.setStatus(CommandStatus.CLOSED);
        command.setCloseTime(LocalDateTime.now());
        Command saved = commandRepository.save(command);
        return toDetailDto(saved);
    }

    @Transactional
    public CommandDetailDto cancelCommand(Long id) {
        Command command = getExistingCommand(id);
        if (command.getStatus() == CommandStatus.CLOSED || command.getStatus() == CommandStatus.CANCELED) {
            throw new ApiException(HttpStatus.CONFLICT, "Command is already closed or canceled");
        }

        command.setStatus(CommandStatus.CANCELED);
        command.setCloseTime(LocalDateTime.now());
        Command saved = commandRepository.save(command);
        return toDetailDto(saved);
    }

    @Transactional
    public CommandDetailDto addOrders(Long id, List<OrderRequest> requests) {
        if (requests == null || requests.isEmpty()) {
            throw new ApiException(HttpStatus.BAD_REQUEST, "At least one order item is required");
        }

        Command command = getExistingCommand(id);
        if (command.getStatus() != CommandStatus.OPEN) {
            throw new ApiException(HttpStatus.CONFLICT, "Orders can only be added to open commands");
        }

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
            command.getOrders().add(order);
        }

        recalculateTotalValue(command);
        Command saved = commandRepository.save(command);
        return toDetailDto(saved);
    }

    @Transactional(readOnly = true)
    public List<CommandDto> listByStatus(CommandStatus status) {
        List<Command> commands = commandRepository.findByStatus(status);
        return commands.stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<CommandDto> listHistory() {
        List<Command> commands = commandRepository.findByStatusInOrderByCloseTimeDesc(
                List.of(CommandStatus.CLOSED, CommandStatus.CANCELED));
        return commands.stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public CommandDetailDto getById(Long id) {
        Command command = commandRepository.findWithDetailsById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comanda", id));
        return toDetailDto(command);
    }

        @Transactional
    public void clearHistory() {
        // NOTE: Deleting historical commands permanently removes sales records.
        // This operation has been disabled to preserve financial data.
        // Future implementations may use soft‑delete or archival tables.
        logger.info("clearHistory called – operation ignored to preserve historical data.");
    }

    @Transactional
    public void recalculateTotalValue(Command command) {
        if (command == null || command.getOrders() == null) {
            return;
        }
        BigDecimal total = command.getOrders().stream()
                .filter(order -> order.getStatus() != OrderStatus.CANCELED && order.getMenuItem() != null)
                .map(order -> order.getMenuItem().getPrice().multiply(BigDecimal.valueOf(order.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        command.setTotalValue(total);
    }

    public CommandDto toDto(Command command) {
        Long employeeId = command.getResponsibleEmployee() != null ? command.getResponsibleEmployee().getId() : null;
        String employeeName = command.getResponsibleEmployee() != null ? command.getResponsibleEmployee().getName() : null;
        return new CommandDto(
                command.getId(),
                command.getTableNumber(),
                command.getCustomerName(),
                command.getStatus().name(),
                command.getTotalValue(),
                command.getOpenTime(),
                command.getCloseTime(),
                employeeId,
                employeeName);
    }

    public CommandDetailDto toDetailDto(Command command) {
        CommandDetailDto.EmployeeInfo employeeInfo = null;
        if (command.getResponsibleEmployee() != null) {
            employeeInfo = new CommandDetailDto.EmployeeInfo(
                    command.getResponsibleEmployee().getId(),
                    command.getResponsibleEmployee().getName());
        }

        List<CommandDetailDto.OrderInfo> orderInfos = command.getOrders() != null
                ? command.getOrders().stream().map(order -> {
                    CommandDetailDto.MenuItemInfo menuItemInfo = null;
                    if (order.getMenuItem() != null) {
                        menuItemInfo = new CommandDetailDto.MenuItemInfo(
                                order.getMenuItem().getId(),
                                order.getMenuItem().getName(),
                                order.getMenuItem().getPrice());
                    }
                    return new CommandDetailDto.OrderInfo(
                            order.getId(),
                            order.getQuantity(),
                            order.getStatus().name(),
                            order.getOrderTime(),
                            menuItemInfo);
                }).toList()
                : List.of();

        return new CommandDetailDto(
                command.getId(),
                command.getTableNumber(),
                command.getCustomerName(),
                command.getStatus().name(),
                command.getTotalValue(),
                command.getOpenTime(),
                command.getCloseTime(),
                employeeInfo,
                orderInfos);
    }

    private Command getExistingCommand(Long id) {
        return commandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Comanda", id));
    }
}
