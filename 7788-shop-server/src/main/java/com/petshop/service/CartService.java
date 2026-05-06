package com.petshop.service;

import com.petshop.dto.request.CartItemRequest;
import com.petshop.entity.CartItem;

import java.util.List;

public interface CartService {
    List<CartItem> listCart(Long userId);
    CartItem addItem(Long userId, CartItemRequest req);
    CartItem updateQuantity(Long userId, Long cartItemId, Integer quantity);
    void removeItem(Long userId, Long cartItemId);
    void clearCart(Long userId);
    void mergeCart(Long userId, List<CartItemRequest> guestItems);
}
