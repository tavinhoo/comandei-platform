package com.restaurant.commands.web.dto;

public class CommandRequest {
    private Integer tableNumber;
    private Long responsibleEmployeeId;
    private String customerName;

    public CommandRequest() {
    }

    public CommandRequest(Integer tableNumber, Long responsibleEmployeeId, String customerName) {
        this.tableNumber = tableNumber;
        this.responsibleEmployeeId = responsibleEmployeeId;
        this.customerName = customerName;
    }

    public Integer getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(Integer tableNumber) {
        this.tableNumber = tableNumber;
    }

    public Long getResponsibleEmployeeId() {
        return responsibleEmployeeId;
    }

    public void setResponsibleEmployeeId(Long responsibleEmployeeId) {
        this.responsibleEmployeeId = responsibleEmployeeId;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }
}
