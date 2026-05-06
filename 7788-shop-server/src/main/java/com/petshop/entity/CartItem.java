package com.petshop.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@TableName("cart_items")
public class CartItem implements Serializable {
    @TableId(type = IdType.AUTO)
    private Long id;

    private Long userId;
    private Long productId;
    private Integer quantity;

    @TableLogic
    private Integer isDeleted;

    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createdAt;

    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updatedAt;

    @TableField(exist = false)
    private String productName;

    @TableField(exist = false)
    private String productImage;

    @TableField(exist = false)
    private java.math.BigDecimal productPrice;
}
