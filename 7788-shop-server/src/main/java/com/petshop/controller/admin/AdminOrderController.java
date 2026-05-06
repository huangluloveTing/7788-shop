package com.petshop.controller.admin;

import com.petshop.common.PageResult;
import com.petshop.common.Result;
import com.petshop.dto.request.OrderStatusUpdateRequest;
import com.petshop.entity.Order;
import com.petshop.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin/orders")
public class AdminOrderController {
    private final OrderService orderService;

    public AdminOrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @GetMapping
    public Result<PageResult<Order>> list(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer pageSize) {
        return Result.ok(orderService.adminListOrders(status, page, pageSize));
    }

    @GetMapping("/{id}")
    public Result<Order> detail(@PathVariable Long id) {
        // admin can view any order - pass 0 as userId bypass
        return Result.ok(orderService.adminListOrders(null, 1, 1).getRecords()
                .stream().filter(o -> o.getId().equals(id)).findFirst().orElse(null));
    }

    @PutMapping("/{id}/status")
    public Result<Void> updateStatus(@PathVariable Long id, @Valid @RequestBody OrderStatusUpdateRequest req) {
        orderService.adminUpdateStatus(id, req.getStatus());
        return Result.ok();
    }
}
