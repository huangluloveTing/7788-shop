package com.petshop.controller;

import com.petshop.common.Result;
import com.petshop.dto.request.CartItemRequest;
import com.petshop.entity.CartItem;
import com.petshop.service.CartService;
import jakarta.validation.Valid;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

    private Long getUserId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @GetMapping
    public Result<List<CartItem>> list() {
        return Result.ok(cartService.listCart(getUserId()));
    }

    @PostMapping
    public Result<CartItem> add(@Valid @RequestBody CartItemRequest req) {
        return Result.ok(cartService.addItem(getUserId(), req));
    }

    @PutMapping("/{id}")
    public Result<CartItem> updateQuantity(@PathVariable Long id, @RequestBody CartItemRequest req) {
        return Result.ok(cartService.updateQuantity(getUserId(), id, req.getQuantity()));
    }

    @DeleteMapping("/{id}")
    public Result<Void> remove(@PathVariable Long id) {
        cartService.removeItem(getUserId(), id);
        return Result.ok();
    }

    @DeleteMapping
    public Result<Void> clear() {
        cartService.clearCart(getUserId());
        return Result.ok();
    }

    @PostMapping("/merge")
    public Result<Void> merge(@RequestBody List<CartItemRequest> items) {
        cartService.mergeCart(getUserId(), items);
        return Result.ok();
    }
}
