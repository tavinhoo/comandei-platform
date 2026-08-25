package com.restaurant.commands.web.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class CommandDetailDto {

    private Long id;
    private Integer tableNumber;
    private String customerName;
    private String status;
    private BigDecimal totalValue;
    private LocalDateTime openTime;
    private LocalDateTime closeTime;
    private EmployeeInfo responsibleEmployee;
    private List<OrderInfo> orders;

    public CommandDetailDto() {
    }

    public CommandDetailDto(Long id, Integer tableNumber, String customerName, String status, BigDecimal totalValue,
            LocalDateTime openTime, LocalDateTime closeTime,
            EmployeeInfo responsibleEmployee, List<OrderInfo> orders) {
        this.id = id;
        this.tableNumber = tableNumber;
        this.customerName = customerName;
        this.status = status;
        this.totalValue = totalValue;
        this.openTime = openTime;
        this.closeTime = closeTime;
        this.responsibleEmployee = responsibleEmployee;
        this.orders = orders;
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

    public EmployeeInfo getResponsibleEmployee() {
        return responsibleEmployee;
    }

    public List<OrderInfo> getOrders() {
        return orders;
    }

    public static class EmployeeInfo {
        private Long id;
        private String name;

        public EmployeeInfo() {
        }

        public EmployeeInfo(Long id, String name) {
            this.id = id;
            this.name = name;
        }

        public Long getId() {
            return id;
        }

        public String getName() {
            return name;
        }
    }

    public static class OrderInfo {
        private Long id;
        private Integer quantity;
        private String status;
        private LocalDateTime orderTime;
        private MenuItemInfo menuItem;

        public OrderInfo() {
        }

        public OrderInfo(Long id, Integer quantity, String status, LocalDateTime orderTime, MenuItemInfo menuItem) {
            this.id = id;
            this.quantity = quantity;
            this.status = status;
            this.orderTime = orderTime;
            this.menuItem = menuItem;
        }

        public Long getId() {
            return id;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public String getStatus() {
            return status;
        }

        public LocalDateTime getOrderTime() {
            return orderTime;
        }

        public MenuItemInfo getMenuItem() {
            return menuItem;
        }
    }

    public static class MenuItemInfo {
        private Long id;
        private String name;
        private BigDecimal price;

        public MenuItemInfo() {
        }

        public MenuItemInfo(Long id, String name, BigDecimal price) {
            this.id = id;
            this.name = name;
            this.price = price;
        }

        public Long getId() {
            return id;
        }

        public String getName() {
            return name;
        }

        public BigDecimal getPrice() {
            return price;
        }
    }
}
