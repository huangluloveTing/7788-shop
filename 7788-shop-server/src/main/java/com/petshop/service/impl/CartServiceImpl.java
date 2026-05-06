package com.petshop.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.petshop.common.BusinessException;
import com.petshop.common.ResultCode;
import com.petshop.dto.request.CartItemRequest;
import com.petshop.entity.CartItem;
import com.petshop.entity.Product;
import com.petshop.mapper.CartItemMapper;
import com.petshop.mapper.ProductMapper;
import com.petshop.service.CartService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartServiceImpl implements CartService {
    private final CartItemMapper cartItemMapper;
    private final ProductMapper productMapper;

    public CartServiceImpl(CartItemMapper cartItemMapper, ProductMapper productMapper) {
        this.cartItemMapper = cartItemMapper;
        this.productMapper = productMapper;
    }

    @Override
    public List<CartItem> listCart(Long userId) {
        List<CartItem> items = cartItemMapper.selectList(
                new LambdaQueryWrapper<CartItem>().eq(CartItem::getUserId, userId));
        for (CartItem item : items) {
            Product product = productMapper.selectById(item.getProductId());
            if (product != null) {
                item.setProductName(product.getName());
                item.setProductImage(product.getMainImage());
                item.setProductPrice(product.getPrice());
            }
        }
        return items;
    }

    @Override
    public CartItem addItem(Long userId, CartItemRequest req) {
        Product product = productMapper.selectById(req.getProductId());
        if (product == null) {
            throw new BusinessException(ResultCode.PRODUCT_NOT_FOUND);
        }

        CartItem existing = cartItemMapper.selectOne(
                new LambdaQueryWrapper<CartItem>()
                        .eq(CartItem::getUserId, userId)
                        .eq(CartItem::getProductId, req.getProductId()));

        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + req.getQuantity());
            cartItemMapper.updateById(existing);
            return enrichCartItem(existing);
        }

        CartItem item = new CartItem();
        item.setUserId(userId);
        item.setProductId(req.getProductId());
        item.setQuantity(req.getQuantity());
        cartItemMapper.insert(item);
        return enrichCartItem(item);
    }

    @Override
    public CartItem updateQuantity(Long userId, Long cartItemId, Integer quantity) {
        CartItem item = cartItemMapper.selectById(cartItemId);
        if (item == null || !item.getUserId().equals(userId)) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        item.setQuantity(quantity);
        cartItemMapper.updateById(item);
        return enrichCartItem(item);
    }

    @Override
    public void removeItem(Long userId, Long cartItemId) {
        CartItem item = cartItemMapper.selectById(cartItemId);
        if (item == null || !item.getUserId().equals(userId)) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        cartItemMapper.deleteById(cartItemId);
    }

    @Override
    public void clearCart(Long userId) {
        cartItemMapper.delete(new LambdaQueryWrapper<CartItem>().eq(CartItem::getUserId, userId));
    }

    @Override
    public void mergeCart(Long userId, List<CartItemRequest> guestItems) {
        for (CartItemRequest req : guestItems) {
            CartItem existing = cartItemMapper.selectOne(
                    new LambdaQueryWrapper<CartItem>()
                            .eq(CartItem::getUserId, userId)
                            .eq(CartItem::getProductId, req.getProductId()));
            if (existing != null) {
                existing.setQuantity(existing.getQuantity() + req.getQuantity());
                cartItemMapper.updateById(existing);
            } else {
                CartItem item = new CartItem();
                item.setUserId(userId);
                item.setProductId(req.getProductId());
                item.setQuantity(req.getQuantity());
                cartItemMapper.insert(item);
            }
        }
    }

    private CartItem enrichCartItem(CartItem item) {
        Product product = productMapper.selectById(item.getProductId());
        if (product != null) {
            item.setProductName(product.getName());
            item.setProductImage(product.getMainImage());
            item.setProductPrice(product.getPrice());
        }
        return item;
    }
}
