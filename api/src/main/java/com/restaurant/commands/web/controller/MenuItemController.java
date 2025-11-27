package com.restaurant.commands.web.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurant.commands.model.MenuItem;
import com.restaurant.commands.repository.MenuItemRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/cardapio")
public class MenuItemController {

    private final MenuItemRepository menuItemRepository;

    public MenuItemController(MenuItemRepository menuItemRepository) {
        this.menuItemRepository = menuItemRepository;
    }

    @PostMapping
    public ResponseEntity<MenuItem> create(@Valid @RequestBody MenuItem item) {
        MenuItem saved = menuItemRepository.save(item);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MenuItem> update(@PathVariable Long id, @RequestBody MenuItem update) {
        return menuItemRepository.findById(id).map(item -> {
            item.setName(update.getName());
            item.setDescription(update.getDescription());
            item.setPrice(update.getPrice());
            item.setIsActive(update.getIsActive());
            menuItemRepository.save(item);
            return ResponseEntity.ok(item);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<MenuItem>> list() {
        return ResponseEntity.ok(menuItemRepository.findByIsActiveTrue());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MenuItem> get(@PathVariable Long id) {
        return menuItemRepository.findById(id).map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deactivate(@PathVariable Long id) {
        return menuItemRepository.findById(id).map(item -> {
            item.setIsActive(false);
            menuItemRepository.save(item);
            return ResponseEntity.noContent().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
