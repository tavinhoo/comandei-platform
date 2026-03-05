package com.restaurant.commands.web.dto;

import com.restaurant.commands.model.OrderStatus;

public class UpdateOrderStatusRequest {
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
