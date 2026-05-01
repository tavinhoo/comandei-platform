package com.restaurant.commands.web.dto;

import com.restaurant.commands.model.OrderStatus;

import jakarta.validation.constraints.NotNull;

public class UpdateOrderStatusRequest {
    @NotNull
    private OrderStatus status;

    public UpdateOrderStatusRequest() {
    }

    public UpdateOrderStatusRequest(OrderStatus status) {
        this.status = status;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }
}
