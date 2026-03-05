package com.restaurant.commands.web.controller;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.commands.model.Order;
import com.restaurant.commands.repository.OrderRepository;
import com.restaurant.commands.web.dto.UpdateOrderStatusRequest;

@RestController
@RequestMapping("/api/pedidos")
public class OrderController {

    private final OrderRepository orderRepository;

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable Long id, @RequestBody UpdateOrderStatusRequest request) {
        Optional<Order> found = orderRepository.findById(id);
        if (found.isEmpty()) return ResponseEntity.notFound().build();
        Order order = found.get();
        order.setStatus(request.getStatus());
        orderRepository.save(order);
        return ResponseEntity.ok(order);
    }
}
