package com.restaurant.commands.web.dto;

import java.time.LocalDateTime;

public class CommandDto {

    private Long id;
    private Integer tableNumber;
    private String status;
    private Double totalValue;
    private LocalDateTime openTime;
    private LocalDateTime closeTime;
    private Long responsibleEmployeeId;
    private String responsibleEmployeeName;
    private String customerName;

    public CommandDto() {
    }

    public CommandDto(Long id, Integer tableNumber, String status, Double totalValue, LocalDateTime openTime,
            LocalDateTime closeTime, Long responsibleEmployeeId, String responsibleEmployeeName, String customerName) {
        this.id = id;
        this.tableNumber = tableNumber;
        this.status = status;
        this.totalValue = totalValue;
        this.openTime = openTime;
        this.closeTime = closeTime;
        this.responsibleEmployeeId = responsibleEmployeeId;
        this.responsibleEmployeeName = responsibleEmployeeName;
        this.customerName = customerName;
    }

    public Long getId() {
        return id;
    }

    public Integer getTableNumber() {
        return tableNumber;
    }

    public String getStatus() {
        return status;
    }

    public Double getTotalValue() {
        return totalValue;
    }

    public LocalDateTime getOpenTime() {
        return openTime;
    }

    public LocalDateTime getCloseTime() {
        return closeTime;
    }

    public Long getResponsibleEmployeeId() {
        return responsibleEmployeeId;
    }

    public String getResponsibleEmployeeName() {
        return responsibleEmployeeName;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }
}
