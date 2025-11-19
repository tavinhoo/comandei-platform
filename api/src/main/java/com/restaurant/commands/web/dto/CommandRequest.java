package com.restaurant.commands.web.dto;

public class CommandRequest {
    private Integer tableNumber;
    private Long responsibleEmployeeId;

    public CommandRequest() {
    }

    public CommandRequest(Integer tableNumber, Long responsibleEmployeeId) {
        this.tableNumber = tableNumber;
        this.responsibleEmployeeId = responsibleEmployeeId;
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
}
