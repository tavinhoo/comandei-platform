package com.restaurant.commands.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.restaurant.commands.exception.BusinessRuleException;
import com.restaurant.commands.exception.ResourceNotFoundException;
import com.restaurant.commands.model.Command;
import com.restaurant.commands.model.Order;
import com.restaurant.commands.model.OrderStatus;
import com.restaurant.commands.repository.CommandRepository;
import com.restaurant.commands.repository.OrderRepository;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CommandRepository commandRepository;
    private final CommandService commandService;

    public OrderService(OrderRepository orderRepository, CommandRepository commandRepository,
            CommandService commandService) {
        this.orderRepository = orderRepository;
        this.commandRepository = commandRepository;
        this.commandService = commandService;
    }

    @Transactional
    public void updateStatus(Long orderId, OrderStatus newStatus) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido", orderId));

        if (newStatus == OrderStatus.CANCELED) {
            cancelOrder(order);
            return;
        }

        order.setStatus(newStatus);
        orderRepository.save(order);
    }

    /**
     * Cancela um pedido e recalcula o totalValue da comanda pai.
     */
    @Transactional
    public void cancelOrder(Long orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Pedido", orderId));
        cancelOrder(order);
    }

    private void cancelOrder(Order order) {
        if (order.getStatus() == OrderStatus.CANCELED) {
            throw new BusinessRuleException("Este pedido já foi cancelado.");
        }

        if (order.getStatus() == OrderStatus.DELIVERED) {
            throw new BusinessRuleException("Não é possível cancelar um pedido já entregue.");
        }

        order.setStatus(OrderStatus.CANCELED);
        orderRepository.save(order);

        // Recalcula o total da comanda usando o método centralizado
        Command command = order.getCommand();
        if (command != null) {
            commandService.recalculateTotalValue(command);
            commandRepository.save(command);
        }
    }
}
