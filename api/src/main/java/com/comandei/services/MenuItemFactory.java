package com.comandei.services;

import com.comandei.models.MenuItem;

public class MenuItemFactory {
    public static MenuItem createMenuItem(String name, String description, Double price) {
        
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("O nome do item não pode ser nulo ou vazio.");
        }
        if (price <= 0) {
            throw new IllegalArgumentException("O preço do item deve ser maior que zero.");
        }
        
        return new MenuItem(name, description, price);
    }
}
