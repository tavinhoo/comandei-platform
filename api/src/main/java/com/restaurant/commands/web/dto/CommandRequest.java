package com.restaurant.commands.web.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class CommandRequest {
    @NotNull
    @Min(1)
    private Integer tableNumber;

    private String customerName;
    private Long responsibleEmployeeId;

    public CommandRequest() {
    }

    public CommandRequest(Integer tableNumber, String customerName, Long responsibleEmployeeId) {
        this.tableNumber = tableNumber;
        this.customerName = customerName;
        this.responsibleEmployeeId = responsibleEmployeeId;
    }

    public Integer getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(Integer tableNumber) {
        this.tableNumber = tableNumber;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public Long getResponsibleEmployeeId() {
        return responsibleEmployeeId;
    }

    public void setResponsibleEmployeeId(Long responsibleEmployeeId) {
        this.responsibleEmployeeId = responsibleEmployeeId;
    }
}
