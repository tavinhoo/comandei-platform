package com.restaurant.commands.web.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CommandDto {

    private Long id;
    private Integer tableNumber;
    private String customerName;
    private String status;
    private BigDecimal totalValue;
    private LocalDateTime openTime;
    private LocalDateTime closeTime;
    private Long responsibleEmployeeId;
    private String responsibleEmployeeName;

    public CommandDto() {
    }

    public CommandDto(Long id, Integer tableNumber, String customerName, String status, BigDecimal totalValue, LocalDateTime openTime, LocalDateTime closeTime, Long responsibleEmployeeId, String responsibleEmployeeName) {
        this.id = id;
        this.tableNumber = tableNumber;
        this.customerName = customerName;
        this.status = status;
        this.totalValue = totalValue;
        this.openTime = openTime;
        this.closeTime = closeTime;
        this.responsibleEmployeeId = responsibleEmployeeId;
        this.responsibleEmployeeName = responsibleEmployeeName;
    }

    public Long getId() {
        return id;
    }

    public Integer getTableNumber() {
        return tableNumber;
    }

    public String getCustomerName() {
        return customerName;
    }

    public String getStatus() {
        return status;
    }

    public BigDecimal getTotalValue() {
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
}
