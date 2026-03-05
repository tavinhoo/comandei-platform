package com.restaurant.commands.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "commands")
public class Command {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer tableNumber;

    @Column(nullable = false)
    private CommandStatus status;

    @Column(nullable = false)
    private LocalDateTime openTime;

    private LocalDateTime closeTime;

    @Column(nullable = false)
    private Double totalValue = 0.0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "responsible_employee_id")
    private User responsibleEmployee;

    @OneToMany(mappedBy = "command", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<Order> orders = new ArrayList<>();

    public Command() {
    }

    public Command(Long id, Integer tableNumber, CommandStatus status, LocalDateTime openTime, LocalDateTime closeTime,
            Double totalValue, User responsibleEmployee, List<Order> orders) {
        this.id = id;
        this.tableNumber = tableNumber;
        this.status = status;
        this.openTime = openTime;
        this.closeTime = closeTime;
        this.totalValue = totalValue;
        this.responsibleEmployee = responsibleEmployee;
        this.orders = orders == null ? new ArrayList<>() : orders;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(Integer tableNumber) {
        this.tableNumber = tableNumber;
    }

    public CommandStatus getStatus() {
        return status;
    }

    public void setStatus(CommandStatus status) {
        this.status = status;
    }

    public LocalDateTime getOpenTime() {
        return openTime;
    }

    public void setOpenTime(LocalDateTime openTime) {
        this.openTime = openTime;
    }

    public LocalDateTime getCloseTime() {
        return closeTime;
    }

    public void setCloseTime(LocalDateTime closeTime) {
        this.closeTime = closeTime;
    }

    public Double getTotalValue() {
        return totalValue;
    }

    public void setTotalValue(Double totalValue) {
        this.totalValue = totalValue;
    }

    public User getResponsibleEmployee() {
        return responsibleEmployee;
    }

    public void setResponsibleEmployee(User responsibleEmployee) {
        this.responsibleEmployee = responsibleEmployee;
    }

    public List<Order> getOrders() {
        return orders;
    }

    public void setOrders(List<Order> orders) {
        this.orders = orders;
    }
}
