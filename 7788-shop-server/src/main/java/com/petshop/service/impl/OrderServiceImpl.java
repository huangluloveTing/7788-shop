package com.petshop.service.impl;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.petshop.common.BusinessException;
import com.petshop.common.PageResult;
import com.petshop.common.ResultCode;
import com.petshop.dto.request.CheckoutRequest;
import com.petshop.entity.*;
import com.petshop.mapper.*;
import com.petshop.service.OrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class OrderServiceImpl implements OrderService {
    private final OrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;
    private final CartItemMapper cartItemMapper;
    private final ProductMapper productMapper;
    private final AddressMapper addressMapper;
    private final UserMapper userMapper;

    public OrderServiceImpl(OrderMapper orderMapper, OrderItemMapper orderItemMapper,
                            CartItemMapper cartItemMapper, ProductMapper productMapper,
                            AddressMapper addressMapper, UserMapper userMapper) {
        this.orderMapper = orderMapper;
        this.orderItemMapper = orderItemMapper;
        this.cartItemMapper = cartItemMapper;
        this.productMapper = productMapper;
        this.addressMapper = addressMapper;
        this.userMapper = userMapper;
    }

    @Override
    @Transactional
    public Order createOrder(Long userId, CheckoutRequest req) {
        List<CartItem> cartItems = cartItemMapper.selectList(
                new LambdaQueryWrapper<CartItem>().eq(CartItem::getUserId, userId));
        if (cartItems.isEmpty()) {
            throw new BusinessException(ResultCode.CART_EMPTY);
        }

        Address addr = addressMapper.selectById(req.getAddressId());
        if (addr == null || !addr.getUserId().equals(userId)) {
            throw new BusinessException(ResultCode.ADDRESS_NOT_FOUND);
        }

        BigDecimal totalAmount = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CartItem cartItem : cartItems) {
            Product product = productMapper.selectById(cartItem.getProductId());
            if (product == null || product.getStock() < cartItem.getQuantity()) {
                throw new BusinessException(ResultCode.STOCK_INSUFFICIENT);
            }
            product.setStock(product.getStock() - cartItem.getQuantity());
            product.setSalesCount(product.getSalesCount() + cartItem.getQuantity());
            productMapper.updateById(product);

            BigDecimal subtotal = product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));
            totalAmount = totalAmount.add(subtotal);

            OrderItem oi = new OrderItem();
            oi.setProductId(product.getId());
            oi.setProductName(product.getName());
            oi.setProductImage(product.getMainImage());
            oi.setPrice(product.getPrice());
            oi.setQuantity(cartItem.getQuantity());
            oi.setSubtotal(subtotal);
            orderItems.add(oi);
        }

        String orderNo = generateOrderNo();
        String addressSnapshot = buildAddressSnapshot(addr);

        Order order = new Order();
        order.setOrderNo(orderNo);
        order.setUserId(userId);
        order.setAddressSnapshot(addressSnapshot);
        order.setTotalAmount(totalAmount);
        order.setStatus("PENDING_PAYMENT");
        orderMapper.insert(order);

        for (OrderItem oi : orderItems) {
            oi.setOrderId(order.getId());
            orderItemMapper.insert(oi);
        }

        cartItemMapper.delete(new LambdaQueryWrapper<CartItem>().eq(CartItem::getUserId, userId));

        order.setItems(orderItems);
        return order;
    }

    @Override
    public PageResult<Order> listOrders(Long userId, String status, Integer page, Integer pageSize) {
        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<Order>()
                .eq(Order::getUserId, userId)
                .eq(StringUtils.hasText(status), Order::getStatus, status)
                .orderByDesc(Order::getCreatedAt);

        Page<Order> mpPage = new Page<>(page != null ? page : 1, pageSize != null ? pageSize : 10);
        Page<Order> result = orderMapper.selectPage(mpPage, wrapper);

        for (Order order : result.getRecords()) {
            List<OrderItem> items = orderItemMapper.selectList(
                    new LambdaQueryWrapper<OrderItem>().eq(OrderItem::getOrderId, order.getId()));
            order.setItems(items);
        }

        return new PageResult<>(result.getRecords(), result.getTotal(), result.getCurrent(), result.getSize());
    }

    @Override
    public Order getOrderDetail(Long userId, Long orderId) {
        Order order = orderMapper.selectById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        List<OrderItem> items = orderItemMapper.selectList(
                new LambdaQueryWrapper<OrderItem>().eq(OrderItem::getOrderId, orderId));
        order.setItems(items);
        return order;
    }

    @Override
    @Transactional
    public void pay(Long userId, Long orderId) {
        Order order = orderMapper.selectById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        if (!"PENDING_PAYMENT".equals(order.getStatus())) {
            throw new BusinessException(ResultCode.ORDER_STATUS_INVALID);
        }
        order.setStatus("PENDING_SHIPPING");
        order.setPaymentTime(LocalDateTime.now());
        orderMapper.updateById(order);
    }

    @Override
    @Transactional
    public void cancel(Long userId, Long orderId) {
        Order order = orderMapper.selectById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        if (!"PENDING_PAYMENT".equals(order.getStatus())) {
            throw new BusinessException(ResultCode.ORDER_STATUS_INVALID);
        }
        order.setStatus("CANCELLED");
        orderMapper.updateById(order);

        List<OrderItem> items = orderItemMapper.selectList(
                new LambdaQueryWrapper<OrderItem>().eq(OrderItem::getOrderId, orderId));
        for (OrderItem item : items) {
            Product product = productMapper.selectById(item.getProductId());
            if (product != null) {
                product.setStock(product.getStock() + item.getQuantity());
                productMapper.updateById(product);
            }
        }
    }

    @Override
    public PageResult<Order> adminListOrders(String status, Integer page, Integer pageSize) {
        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<Order>()
                .eq(StringUtils.hasText(status), Order::getStatus, status)
                .orderByDesc(Order::getCreatedAt);

        Page<Order> mpPage = new Page<>(page != null ? page : 1, pageSize != null ? pageSize : 10);
        Page<Order> result = orderMapper.selectPage(mpPage, wrapper);

        for (Order order : result.getRecords()) {
            List<OrderItem> items = orderItemMapper.selectList(
                    new LambdaQueryWrapper<OrderItem>().eq(OrderItem::getOrderId, order.getId()));
            order.setItems(items);
            User user = userMapper.selectById(order.getUserId());
            if (user != null) {
                order.setUsername(user.getUsername());
            }
        }

        return new PageResult<>(result.getRecords(), result.getTotal(), result.getCurrent(), result.getSize());
    }

    @Override
    public void adminUpdateStatus(Long orderId, String status) {
        Order order = orderMapper.selectById(orderId);
        if (order == null) {
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        order.setStatus(status);
        orderMapper.updateById(order);
    }

    private String generateOrderNo() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String random = String.format("%06d", new Random().nextInt(1_000_000));
        return timestamp + random;
    }

    private String buildAddressSnapshot(Address addr) {
        return String.format(
                "{\"receiverName\":\"%s\",\"phone\":\"%s\",\"province\":\"%s\",\"city\":\"%s\",\"district\":\"%s\",\"detail\":\"%s\"}",
                addr.getReceiverName(), addr.getPhone(), addr.getProvince(),
                addr.getCity(), addr.getDistrict(), addr.getDetail());
    }
}
