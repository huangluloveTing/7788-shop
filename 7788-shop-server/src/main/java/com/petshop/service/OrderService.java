package com.petshop.service;

import com.petshop.common.PageResult;
import com.petshop.dto.request.CheckoutRequest;
import com.petshop.entity.Order;

public interface OrderService {
    Order createOrder(Long userId, CheckoutRequest req);
    PageResult<Order> listOrders(Long userId, String status, Integer page, Integer pageSize);
    Order getOrderDetail(Long userId, Long orderId);
    void pay(Long userId, Long orderId);
    void cancel(Long userId, Long orderId);
    PageResult<Order> adminListOrders(String status, Integer page, Integer pageSize);
    void adminUpdateStatus(Long orderId, String status);
}
