package com.petshop.controller;

import com.petshop.common.PageResult;
import com.petshop.common.Result;
import com.petshop.dto.request.CheckoutRequest;
import com.petshop.entity.Order;
import com.petshop.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    private Long getUserId() {
        return (Long) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    @PostMapping
    public Result<Order> create(@Valid @RequestBody CheckoutRequest req) {
        return Result.ok(orderService.createOrder(getUserId(), req));
    }

    @GetMapping
    public Result<PageResult<Order>> list(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        return Result.ok(orderService.listOrders(getUserId(), status, page, pageSize));
    }

    @GetMapping("/{id}")
    public Result<Order> detail(@PathVariable Long id) {
        return Result.ok(orderService.getOrderDetail(getUserId(), id));
    }

    @PutMapping("/{id}/pay")
    public Result<Void> pay(@PathVariable Long id) {
        orderService.pay(getUserId(), id);
        return Result.ok();
    }

    @PutMapping("/{id}/cancel")
    public Result<Void> cancel(@PathVariable Long id) {
        orderService.cancel(getUserId(), id);
        return Result.ok();
    }
}
